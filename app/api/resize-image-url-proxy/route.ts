import { NextResponse } from 'next/server';
import sharp from 'sharp';
import fetch from 'node-fetch';
import FormData from 'form-data'; // Import form-data

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    const urlObject = new URL(request.url);
    const searchParams = urlObject.searchParams; 

    const url = searchParams.get('url');

    const width = parseInt(searchParams.get('width') || '64', 10);
    const height = parseInt(searchParams.get('height') || '64', 10);
    const isResize = searchParams.get('isResize');

    if (!url) {
      return NextResponse.json({ error: 'MESSAGE_URL_REQUIRED' }, { status: 400 });
    }

    // Fetch the image from the URL
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: 'MESSAGE_FAIL_TO_FETCH_IMAGE' }, { status: 400 });
    }
    
    const buffer = await response.buffer();
     // Create a sharp instance to get metadata
     const image = sharp(buffer);
     const metadata = await image.metadata(); // Get image metadata

    if(!isResize){
      return NextResponse.json({
        url: url,
        width: metadata.width,
        height: metadata.height
      });
    }
    // if isResize make resize image
    // Resize the image to the specified width and height
    const resizedImage = await sharp(buffer)
    .resize(width, height) // Resize image
    .png() // Convert to PNG
    
    // UPLOAD to Backend
     // Get the authorization token from headers
     const authToken = request.headers.get('Authorization')?.split(' ')[1]; // Extract token from Bearer scheme

    const formData = new FormData();
    formData.append('image', resizedImage, { filename: 'resized-image.png', contentType: 'image/png' }); // Append the resized image as a file
    
    const uploadUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/tasks/upload`;
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      headers: {
      'Authorization': `Bearer ${authToken}`, // Include the token in the upload request
      },
    });

      // Check if the upload was successful
    if (!uploadResponse.ok) {
      const errorResponse = await uploadResponse.json();
      console.error('Upload failed:', errorResponse);
      return NextResponse.json({ error: 'MESSAGE_FAIL_TO_FETCH_UPLOAD' }, { status: 500 });
    }

    // If you want to return the upload response directly
    const uploadData = await uploadResponse.json(); // Parse the JSON response
    return NextResponse.json(uploadData, { status: uploadResponse.status }); // Return the upload response
  } catch (error) {
    console.error('Error in resize-image-url:', error);
    return NextResponse.json({ error: 'MESSAGE_FAIL_TO_PROCESS_IMAGE' }, { status: 500 });
  }
}