import { createClient } from '../utils/supabase/server';

export default async function Notes() {
  const supabase = await createClient();
  const { data: notes } = await supabase.from("test_table").select();
  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}