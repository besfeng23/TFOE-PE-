import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DigitalIDProps {
  member: {
    id: string;
    fullName: string;
    membershipNumber: string;
    clubName: string;
    status: string;
    avatarUrl?: string;
  };
}

export const DigitalID: React.FC<DigitalIDProps> = ({ member }) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${member.id}`;

  return (
    <Card className="w-full max-w-sm mx-auto bg-gradient-to-br from-blue-900 to-indigo-900 text-white shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold tracking-tight">TFOE-PE DIGITAL ID</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
          {member.avatarUrl ? (
            <img src={member.avatarUrl} alt={member.fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-400 flex items-center justify-center text-4xl font-bold">
              {member.fullName.charAt(0)}
            </div>
          )}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold uppercase">{member.fullName}</h2>
          <p className="text-indigo-200 text-sm">{member.membershipNumber}</p>
        </div>

        <div className="bg-white p-2 rounded-lg">
          <QRCodeSVG value={verificationUrl} size={150} level="H" />
        </div>

        <div className="w-full grid grid-cols-2 gap-4 text-xs">
          <div className="text-left">
            <p className="text-indigo-300 uppercase">Club</p>
            <p className="font-semibold">{member.clubName}</p>
          </div>
          <div className="text-right">
            <p className="text-indigo-300 uppercase">Status</p>
            <p className="font-semibold text-green-400">{member.status}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
