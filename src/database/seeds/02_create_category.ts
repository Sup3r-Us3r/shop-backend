import Knex from 'knex';

export async function seed(knex: Knex) {
  return knex('tb_category').insert([
    {
      name: 'Natura',
      image: JSON.stringify({
        public_id: '000',
        url: 'https://images.unsplash.com/photo-1502786129293-79981df4e689?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTZ8fGxhbmRzY2FwZXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      }),
    },
    {
      name: 'Tapetes',
      image: JSON.stringify({
        public_id: '111',
        url: 'https://images.unsplash.com/photo-1502786129293-79981df4e689?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTZ8fGxhbmRzY2FwZXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      }),
    },
    {
      name: 'Cama mesa e banho',
      image: JSON.stringify({
        public_id: '222',
        url: 'https://images.unsplash.com/photo-1502786129293-79981df4e689?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTZ8fGxhbmRzY2FwZXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      }),
    },
    {
      name: 'Kits',
      image: JSON.stringify({
        public_id: '333',
        url: 'https://images.unsplash.com/photo-1502786129293-79981df4e689?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTZ8fGxhbmRzY2FwZXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      }),
    },
  ]);
}
