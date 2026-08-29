// Scratch script proving the Neon connection + Prisma relations work end-to-end.
// Run with: npx tsx prisma/verify-connection.ts
// Student/Marks are throwaway placeholder models (Block 2) — replaced by the
// real User/Wallet schema in Block 3.
import "dotenv/config";
import { prisma } from "@/lib/prisma";

async function main(){
    const student = await prisma.student.create({
        data: {
            email: "arpanbose@gmail.com",
            firstname: "Arpan",
            lastname: "Bose",
            marks: {
                create: {
                    physics: 83,
                    chemistry: 86,
                    maths: 94,
                    computer: 96
                }
            }
        },
        include: {
            marks: true
        },
    });
    console.log("Created student: ", student);

    const results = await prisma.student.findMany({
        include: {
            marks: true
        },
    });
    console.log("All students: ", JSON.stringify(results, null, 2));
}

main()
    .then(async ()=>{
        await prisma.$disconnect();
    })
    .catch(async (err)=>{
        console.log(err);
        await prisma.$disconnect();
        process.exit(1);
    });
