function randomDateInPastYear() {
  const now = new Date();
  const pastYear = new Date();
  pastYear.setFullYear(now.getFullYear() - 1);
  return new Date(pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime())).toISOString();
}

export const invoices = [
  {
    id: 'invoice1',
    clientId: 'client1',
    items: [
      { itemId: 'item1', quantity: 2 },
      { itemId: 'item2', quantity: 1 },
    ],
    total: 299.97,
    status: 'paid',
    createdAt: randomDateInPastYear(),
  },
  {
    id: 'invoice2',
    clientId: 'client2',
    items: [
      { itemId: 'item1', quantity: 1 },
    ],
    total: 49.99,
    status: 'overdue',
    createdAt: randomDateInPastYear(),
  },
  {
    id: 'invoice3',
    clientId: 'client3',
    items: [
      { itemId: 'item4', quantity: 3 },
    ],
    total: 89.97,
    status: 'pending',
    createdAt: randomDateInPastYear(),
  },
  {
    id: 'invoice4',
    clientId: 'client4',
    items: [
      { itemId: 'item5', quantity: 2 },
      { itemId: 'item6', quantity: 1 },
    ],
    total: 239.97,
    status: 'paid',
    createdAt: randomDateInPastYear(),
  },
  {
    id: 'invoice5',
    clientId: 'client5',
    items: [
      { itemId: 'item3', quantity: 5 },
    ],
    total: 399.95,
    status: 'overdue',
    createdAt: randomDateInPastYear(),
  },
  {
    id: 'invoice6',
    clientId: 'client6',
    items: [
      { itemId: 'item7', quantity: 1 },
    ],
    total: 299.99,
    status: 'pending',
    createdAt: randomDateInPastYear(),
  },
  {
    id: 'invoice7',
    clientId: 'client7',
    items: [
      { itemId: 'item9', quantity: 2 },
    ],
    total: 79.98,
    status: 'paid',
    createdAt: randomDateInPastYear(),
  },
  {
    id: 'invoice8',
    clientId: 'client8',
    items: [
      { itemId: 'item8', quantity: 4 },
    ],
    total: 79.96,
    status: 'overdue',
    createdAt: randomDateInPastYear(),
  },
  {
    id: 'invoice9',
    clientId: 'client9',
    items: [
      { itemId: 'item10', quantity: 1 },
    ],
    total: 149.99,
    status: 'pending',
    createdAt: randomDateInPastYear(),
  },
  {
    id: 'invoice10',
    clientId: 'client10',
    items: [
      { itemId: 'item12', quantity: 3 },
    ],
    total: 74.97,
    status: 'paid',
    createdAt: randomDateInPastYear(),
  },
  {
    id: 'invoice11',
    clientId: 'client11',
    items: [
      { itemId: 'item15', quantity: 1 },
    ],
    total: 129.99,
    status: 'pending',
    createdAt: randomDateInPastYear(),
  },
  {
    id: 'invoice12',
    clientId: 'client12',
    items: [
      { itemId: 'item16', quantity: 6 },
    ],
    total: 89.94,
    status: 'overdue',
    createdAt: randomDateInPastYear(),
  },
  {
    id: 'invoice13',
    clientId: 'client13',
    items: [
      { itemId: 'item17', quantity: 1 },
    ],
    total: 179.99,
    status: 'paid',
    createdAt: randomDateInPastYear(),
  },
  {
    id: 'invoice14',
    clientId: 'client14',
    items: [
      { itemId: 'item18', quantity: 2 },
    ],
    total: 79.98,
    status: 'pending',
    createdAt: randomDateInPastYear(),
  },
  {
    id: 'invoice15',
    clientId: 'client15',
    items: [
      { itemId: 'item19', quantity: 1 },
    ],
    total: 54.99,
    status: 'paid',
    createdAt: randomDateInPastYear(),
  },
  {
    id: 'invoice16',
    clientId: 'client16',
    items: [
      { itemId: 'item20', quantity: 1 },
    ],
    total: 139.99,
    status: 'overdue',
    createdAt: randomDateInPastYear(),
  },
  {
    id: 'invoice17',
    clientId: 'client17',
    items: [
      { itemId: 'item1', quantity: 2 },
    ],
    total: 99.98,
    status: 'pending',
    createdAt: randomDateInPastYear(),
  },
  {
    id: 'invoice18',
    clientId: 'client18',
    items: [
      { itemId: 'item2', quantity: 1 },
    ],
    total: 199.99,
    status: 'paid',
    createdAt: randomDateInPastYear(),
  },
  {
    id: 'invoice19',
    clientId: 'client19',
    items: [
      { itemId: 'item3', quantity: 2 },
    ],
    total: 159.98,
    status: 'pending',
    createdAt: randomDateInPastYear(),
  },
  {
    id: 'invoice20',
    clientId: 'client20',
    items: [
      { itemId: 'item4', quantity: 5 },
    ],
    total: 149.95,
    status: 'overdue',
    createdAt: randomDateInPastYear(),
  }
];
