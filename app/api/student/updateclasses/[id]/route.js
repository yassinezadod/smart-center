import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import path from 'path';
import fs from 'fs';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function PUT(request, { params }) {
  const form = new formidable.IncomingForm();
  
  return new Promise((resolve, reject) => {
    form.parse(request, async (err, fields, files) => {
      if (err) {
        return reject(new NextResponse('Something went wrong', { status: 500 }));
      }

      const { picture } = files;
      const picturePath = picture && picture[0].filepath;
      let pictureUrl = fields.picture;

      if (picture) {
        // Save file to a public folder
        pictureUrl = `/uploads/${picture[0].originalFilename}`;
        const newPicturePath = path.join(process.cwd(), 'public/uploads', picture[0].originalFilename);
        fs.renameSync(picturePath, newPicturePath);
      }

      try {
        const updatedStudent = await prisma.student.update({
          where: { id: parseInt(params.id) },
          data: {
            ...fields,
            picture: pictureUrl
          },
        });
        resolve(new NextResponse(JSON.stringify(updatedStudent), { status: 200 }));
      } catch (error) {
        reject(new NextResponse('Error updating student', { status: 500 }));
      }
    });
  });
}
