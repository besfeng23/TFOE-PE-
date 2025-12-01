import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const applicationFees = [
    { item: "National Affiliation Fee", amount: "P 500.00" },
    { item: "National Annual Dues", amount: "P 500.00" },
    { item: "National President' Operating Fund", amount: "P 500.00" },
    { item: "ORIENTS Fee", amount: "P 500.00" },
    { item: "Regional Operation Fund", amount: "P 500.00" },
    { item: "Club Operational Fund", amount: "P 500.00" },
    { item: "Eagles Magna Carta", amount: "P 300.00" },
    { item: "Mortuary", amount: "P 200.00" },
    { item: "Alalayang Agila and Calamity Fund", amount: "P 100.00" },
    { item: "Eagles Pin", amount: "P 100.00" },
    { item: "Eagles' Foundation", amount: "P 100.00" },
    { item: "RGL Fund", amount: "P 100.00" },
    { item: "National ID Fee", amount: "P 100.00" },
];

const renewalFees = [
    { item: "National Annual Dues", amount: "P 300.00" },
    { item: "Regional Dues", amount: "P 200.00" },
    { item: "Club Share", amount: "P 200.00" },
    { item: "Mortuary", amount: "P 200.00" },
    { item: "National Office Operating Fund", amount: "P 100.00" },
    { item: "National Office Rental Fund", amount: "P 100.00" },
    { item: "National ID Renewal", amount: "P 100.00" },
];

export default function FeesPage() {
    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Official Membership Fees</CardTitle>
                    <CardDescription>Based on Administrative Order No. 001, Series of 2025.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Membership Application Fees</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Items</TableHead>
                                        <TableHead className="text-right">Allocation</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applicationFees.map((fee, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{fee.item}</TableCell>
                                            <TableCell className="text-right">{fee.amount}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="font-bold">
                                        <TableCell>TOTAL FEES</TableCell>
                                        <TableCell className="text-right">P 4,000.00</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Regular Members Annual Renewal Fees</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Items</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {renewalFees.map((fee, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{fee.item}</TableCell>
                                            <TableCell className="text-right">{fee.amount}</TableCell>
                                        </TableRow>
                                    ))}
                                     <TableRow className="font-bold">
                                        <TableCell>TOTAL FEES</TableCell>
                                        <TableCell className="text-right">P 1,200.00</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}