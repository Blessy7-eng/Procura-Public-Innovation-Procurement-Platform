/**
 * Seed store representation for in-memory & database bootstrapping
 */
export const seedStore = {
  departments: [
    {
      id: 'dept-1',
      name: 'Urban Development Department',
      state: 'Maharashtra',
      city: 'Pune',
      jurisdiction: 'Central Municipal Zone'
    }
  ],
  users: [
    {
      id: 'usr-gov-1',
      name: 'Officer Rajesh Varma',
      email: 'rajesh.varma@urban.gov.in',
      role: 'government'
    },
    {
      id: 'usr-startup-1',
      name: 'Aarav Sharma',
      email: 'aarav@ecotrack.io',
      role: 'startup'
    },
    {
      id: 'usr-eval-1',
      name: 'Dr. Priya Sundaram',
      email: 'priya.sundaram@iitb.ac.in',
      role: 'evaluator'
    }
  ]
};
