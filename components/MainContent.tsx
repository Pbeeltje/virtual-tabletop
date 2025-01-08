'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function MainContent() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImage = e.target?.result as string
        setUploadedImages([...uploadedImages, newImage])
        setSelectedImage(newImage)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-4">
        {selectedImage ? (
          <div className="relative w-full h-full">
            <Image
              src={selectedImage}
              alt="Selected image"
              layout="fill"
              objectFit="contain"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No image selected
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-100 border-t">
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />
        <ScrollArea className="h-24">
          <div className="flex space-x-2">
            {uploadedImages.map((image, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => setSelectedImage(image)}
                className="p-1"
              >
                <Image
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  width={50}
                  height={50}
                  objectFit="cover"
                />
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

