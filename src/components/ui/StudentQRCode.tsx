import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';

interface StudentQRCodeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentData: {
    fullName: string;
    rollNumber: string;
    registrationNumber: string;
    class: string;
    semester: string;
  };
}

export function StudentQRCode({ open, onOpenChange, studentData }: StudentQRCodeProps) {
  const qrValue = JSON.stringify({
    name: studentData.fullName,
    roll: studentData.rollNumber,
    reg: studentData.registrationNumber,
    class: studentData.class,
    semester: studentData.semester,
  });

  const handleDownload = () => {
    const svg = document.getElementById('student-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      ctx?.fillRect(0, 0, 300, 300);
      ctx?.drawImage(img, 0, 0, 300, 300);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${studentData.rollNumber}-QR.png`;
      a.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-foreground">Student ID QR Code</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6">
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <QRCodeSVG
              id="student-qr-code"
              value={qrValue}
              size={200}
              level="H"
              includeMargin
              bgColor="#ffffff"
              fgColor="#0f172a"
            />
          </div>
          
          <div className="text-center mt-4 space-y-1">
            <p className="font-semibold text-foreground">{studentData.fullName}</p>
            <p className="text-sm text-muted-foreground">{studentData.rollNumber}</p>
            <p className="text-xs text-muted-foreground">
              Class {studentData.class} - {studentData.semester}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${studentData.fullName} - Student ID`,
                  text: `Roll: ${studentData.rollNumber}\nReg: ${studentData.registrationNumber}`,
                });
              }
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
