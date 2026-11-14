import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

/** Returns public URLs for all image files in a given storage bucket. */
export async function getBucketImageUrls(bucket: string = 'Memory'): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage.from(bucket).list('', {
      limit: 100,
      sortBy: { column: 'name', order: 'asc' },
    });

    if (error || !data) {
      console.warn('[Supabase] Storage list error:', error?.message);
      return [];
    }

    const urls = data
      .filter((file) => /\.(jpe?g|png|webp|gif|avif)$/i.test(file.name))
      .map((file) => supabase.storage.from(bucket).getPublicUrl(file.name).data.publicUrl);

    console.log(`[Supabase] Loaded ${urls.length} images from bucket "${bucket}"`);
    return urls;
  } catch (err) {
    console.error('[Supabase] Unexpected error fetching bucket images:', err);
    return [];
  }
}
