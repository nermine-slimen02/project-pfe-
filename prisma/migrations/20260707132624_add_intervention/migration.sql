-- CreateTable
CREATE TABLE "Intervention" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "technicianId" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "rapport" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "tempsPasse" INTEGER,
    "actionsRealisees" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Intervention_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Intervention" ADD CONSTRAINT "Intervention_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intervention" ADD CONSTRAINT "Intervention_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
