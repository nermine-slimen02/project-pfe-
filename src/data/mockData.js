export const availableRoles = ['USER', 'TECHNICIAN', 'SUPERVISOR', 'ADMIN'];

export const roleLabels = {
  USER: 'Demandeur',
  TECHNICIAN: 'Technicien',
  SUPERVISOR: 'Superviseur',
  ADMIN: 'Administrateur',
};

export const users = [
  {
    id: 5,
    name: 'Nermine Slimen',
    email: 'nermineslimen02@gmail.com',
    role: 'ADMIN',
    password: 'nounou@22',
  },
  { id: 1, name: 'Lina Dupont', email: 'lina.dupont@example.com', role: 'USER', password: 'demo123' },
  { id: 2, name: 'Mehdi Khelifi', email: 'mehdi.khelifi@example.com', role: 'TECHNICIAN', password: 'tech123' },
  { id: 3, name: 'Sofia Ben Salah', email: 'sofia.bensalah@example.com', role: 'SUPERVISOR', password: 'super123' },
  { id: 4, name: 'Amine Cherif', email: 'amine.cherif@example.com', role: 'ADMIN', password: 'admin123' },
];

export const priorities = {
  Critique: { label: 'Critique', badge: 'bg-red-50 text-red-800', border: 'bg-red-500' },
  Haute: { label: 'Haute', badge: 'bg-amber-50 text-amber-900', border: 'bg-amber-500' },
  Normale: { label: 'Normale', badge: 'bg-blue-50 text-blue-900', border: 'bg-blue-500' },
  Basse: { label: 'Basse', badge: 'bg-slate-100 text-slate-700', border: 'bg-slate-400' },
};

export const priorityMap = {
  LOW: 'Basse',
  MEDIUM: 'Normale',
  HIGH: 'Haute',
  CRITICAL: 'Critique',
};

export const statuses = {
  Nouveau: { label: 'Nouveau', badge: 'bg-sky-100 text-sky-800' },
  Assigné: { label: 'Assigné', badge: 'bg-violet-100 text-violet-800' },
  'En cours': { label: 'En cours', badge: 'bg-amber-100 text-amber-800' },
  'En attente': { label: 'En attente', badge: 'bg-slate-100 text-slate-800' },
  Résolu: { label: 'Résolu', badge: 'bg-emerald-100 text-emerald-800' },
  Fermé: { label: 'Fermé', badge: 'bg-slate-900 text-white' },
};

export const statusMap = {
  OPEN: 'Nouveau',
  IN_PROGRESS: 'En cours',
  RESOLVED: 'Résolu',
  CLOSED: 'Fermé',
};

export const tickets = [
  {
    id: 'TCK-1054',
    title: 'Imprimante réseau ne fonctionne plus',
    requester: 'Lina Dupont',
    category: 'Impression',
    priority: 'Critique',
    status: 'Assigné',
    location: 'Bureau 305',
    slaRemaining: 2.5,
    assignedTo: 'Mehdi Khelifi',
    createdAt: '2026-07-25 09:12',
    description: 'L’imprimante partagée du service comptabilité ne répond plus depuis ce matin.',
  },
  {
    id: 'TCK-1055',
    title: 'Problème de connexion VPN',
    requester: 'Yasmine K.',
    category: 'Réseau',
    priority: 'Haute',
    status: 'Nouveau',
    location: 'Télétravail',
    slaRemaining: 5.75,
    assignedTo: 'Non assigné',
    createdAt: '2026-07-25 11:35',
    description: 'Impossible de se connecter au VPN depuis la mise à jour Windows.',
  },
  {
    id: 'TCK-1056',
    title: 'PC lent au démarrage',
    requester: 'Romain D.',
    category: 'Matériel',
    priority: 'Normale',
    status: 'En cours',
    location: 'Bureau 202',
    slaRemaining: 18,
    assignedTo: 'Mehdi Khelifi',
    createdAt: '2026-07-24 16:50',
    description: 'Le poste prend plus de 8 minutes pour être opérationnel.',
  },
  {
    id: 'TCK-1057',
    title: 'Demande de création de compte service RH',
    requester: 'Nadia R.',
    category: 'Comptes',
    priority: 'Basse',
    status: 'En attente',
    location: 'Bureau 101',
    slaRemaining: 50,
    assignedTo: 'Amine Cherif',
    createdAt: '2026-07-24 09:05',
    description: 'Besoin d’accès au portail RH pour la nouvelle recrue.',
  },
];

export const comments = [
  {
    id: 1,
    ticketId: 'TCK-1054',
    author: 'Mehdi Khelifi',
    role: 'Technicien',
    content: 'Vérification du toner et redémarrage du service d’impression.',
    date: '2026-07-25 10:05',
  },
  {
    id: 2,
    ticketId: 'TCK-1056',
    author: 'Romain D.',
    role: 'Demandeur',
    content: 'Le problème persiste après redémarrage.',
    date: '2026-07-24 18:20',
  },
  {
    id: 3,
    ticketId: 'TCK-1057',
    author: 'Amine Cherif',
    role: 'Administrateur',
    content: 'Compte créé et droits assignés.',
    date: '2026-07-24 10:12',
  },
];

export const notifications = [
  {
    id: 1,
    title: 'Alerte SLA critique',
    message: 'Le ticket TCK-1054 atteint son délai critique dans moins de 3 heures.',
    type: 'critique',
    time: '15 min ago',
  },
  {
    id: 2,
    title: 'Nouveau ticket créé',
    message: 'Un nouveau ticket a été ouvert par Yasmine K. pour un problème VPN.',
    type: 'info',
    time: '45 min ago',
  },
  {
    id: 3,
    title: 'Assignation terminée',
    message: 'Le ticket TCK-1056 a été assigné à Mehdi Khelifi.',
    type: 'success',
    time: '2h ago',
  },
];

export const auditLogs = [
  { id: 1, event: 'Création de catégorie', actor: 'Amine Cherif', target: 'Catégorie Réseau', time: '2026-07-25 08:12' },
  { id: 2, event: 'Changement de statut', actor: 'Mehdi Khelifi', target: 'TCK-1056 → En cours', time: '2026-07-24 17:03' },
  { id: 3, event: 'Modification de localisation', actor: 'Sofia Ben Salah', target: 'Bureau 305', time: '2026-07-24 14:29' },
];

export const categories = ['Impression', 'Réseau', 'Matériel', 'Comptes', 'Logiciel'];
export const locations = ['Bureau 101', 'Bureau 202', 'Bureau 305', 'Open space', 'Télétravail'];
