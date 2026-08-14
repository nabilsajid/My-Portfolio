import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);

// --- HOME CONTENT ---
export async function getHomeContent() {
  const { data, error } = await supabase.from('home_content').select('*').limit(1).single();
  if (error && error.code !== 'PGRST116') console.error('Error fetching home content:', error);
  return data;
}

export async function updateHomeContent(id: number, data: any) {
  const { data: result, error } = await supabase
    .from('home_content')
    .update({
      name: data.name,
      tagline: data.tagline,
      hero_image_desktop_url: data.hero_image_desktop_url,
      hero_image_mobile_url: data.hero_image_mobile_url,
      projects_completed: data.projects_completed,
      happy_clients: data.happy_clients,
      years_experience: data.years_experience,
      views_generated: data.views_generated,
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return result;
}

// --- ACHIEVEMENTS ---
export async function getAchievements() {
  const { data, error } = await supabase.from('achievements').select('*').order('id', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addAchievement(achievement: any) {
  const { data, error } = await supabase
    .from('achievements')
    .insert([{ title: achievement.title, role: achievement.role, description: achievement.description, icon: achievement.icon }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateAchievement(id: number, achievement: any) {
  const { data, error } = await supabase
    .from('achievements')
    .update({ title: achievement.title, role: achievement.role, description: achievement.description, icon: achievement.icon })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteAchievement(id: number) {
  const { error } = await supabase.from('achievements').delete().eq('id', id);
  if (error) throw error;
}

// --- PROJECTS ---
export async function getProjects() {
  const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addProject(project: any) {
  const { data, error } = await supabase
    .from('projects')
    .insert([{ 
      title: project.title, 
      category: project.category, 
      image_url: project.image_url, 
      label: project.label || null,
      video_url: project.video_url || null,
      gallery_images: project.gallery_images || null
    }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateProject(id: number, project: any) {
  const { data, error } = await supabase
    .from('projects')
    .update({ 
      title: project.title, 
      category: project.category, 
      image_url: project.image_url, 
      label: project.label || null,
      video_url: project.video_url || null,
      gallery_images: project.gallery_images || null
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteProject(id: number) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

// --- SKILLS ---
export async function getSkills() {
  const { data, error } = await supabase.from('skills').select('*').order('id', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addSkill(skill: any) {
  const { data, error } = await supabase
    .from('skills')
    .insert([{ name: skill.name, level: skill.level, details: skill.details }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateSkill(id: number, skill: any) {
  const { data, error } = await supabase
    .from('skills')
    .update({ name: skill.name, level: skill.level, details: skill.details })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteSkill(id: number) {
  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) throw error;
}

// --- EXPERIENCE ---
export async function getExperience() {
  const { data, error } = await supabase.from('experience').select('*').order('id', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addExperience(exp: any) {
  const { data, error } = await supabase
    .from('experience')
    .insert([{ role: exp.role, company: exp.company, period: exp.period, description: exp.description }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateExperience(id: number, exp: any) {
  const { data, error } = await supabase
    .from('experience')
    .update({ role: exp.role, company: exp.company, period: exp.period, description: exp.description })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteExperience(id: number) {
  const { error } = await supabase.from('experience').delete().eq('id', id);
  if (error) throw error;
}

// --- FAQs ---
export async function getFaqs() {
  const { data, error } = await supabase.from('faqs').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addFaq(faq: any) {
  const { data, error } = await supabase
    .from('faqs')
    .insert([{ question: faq.question, answer: faq.answer, sort_order: faq.sort_order }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateFaq(id: number, faq: any) {
  const { data, error } = await supabase
    .from('faqs')
    .update({ question: faq.question, answer: faq.answer, sort_order: faq.sort_order })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteFaq(id: number) {
  const { error } = await supabase.from('faqs').delete().eq('id', id);
  if (error) throw error;
}

// --- PRICING PACKETS ---
export async function getPricingPackets() {
  const { data, error } = await supabase.from('pricing_packets').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addPricingPacket(packet: any) {
  const { data, error } = await supabase
    .from('pricing_packets')
    .insert([{
      id: packet.id, name: packet.name, tagline: packet.tagline, base_price: packet.base_price, 
      base_videos: packet.base_videos, base_reels: packet.base_reels, video_max_min: packet.video_max_min,
      video_style: packet.video_style, reel_style: packet.reel_style, extra_video_price: packet.extra_video_price, 
      extra_reel_price: packet.extra_reel_price, extra_minute_price: packet.extra_minute_price,
      max_reels: packet.max_reels, exclusive: packet.exclusive, best_for: packet.best_for, 
      reference_url: packet.reference_url, featured: packet.featured, delivery: packet.delivery, sort_order: packet.sort_order
    }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updatePricingPacket(id: string, packet: any) {
  const { data, error } = await supabase
    .from('pricing_packets')
    .update({
      name: packet.name, tagline: packet.tagline, base_price: packet.base_price, 
      base_videos: packet.base_videos, base_reels: packet.base_reels, video_max_min: packet.video_max_min, 
      video_style: packet.video_style, reel_style: packet.reel_style, extra_video_price: packet.extra_video_price, 
      extra_reel_price: packet.extra_reel_price, extra_minute_price: packet.extra_minute_price, 
      max_reels: packet.max_reels, exclusive: packet.exclusive, best_for: packet.best_for, 
      reference_url: packet.reference_url, featured: packet.featured, delivery: packet.delivery, sort_order: packet.sort_order
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deletePricingPacket(id: string) {
  const { error } = await supabase.from('pricing_packets').delete().eq('id', id);
  if (error) throw error;
}