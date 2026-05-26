import WebApp from "@twa-dev/sdk";

const api_key_1 = 'f1912967-e675'
const api_key_2 = '-4203-a821'
const api_key_3 = '-69a1f188e6db'
const api_key_secret_1 = '6694eef272ba6b6ebb6e32c'
const api_key_secret_2 = '5218b1be1a4b11cb1eb103c30'
const api_key_secret_3 = '094e88e3bdb71f46'

export const generateVideo = async (image_url: string, motion_id: string) => {
  const payload = {
      params: {
          model: "dop-turbo",
          prompt: "prompt",
          input_images: [
              {
                  type: "image_url",
                  image_url: image_url
              }
          ],
          motions: [
              {
                  id: motion_id,
                  strength: 0.1
              }
          ],
          enhance_prompt: true
      }
  }
  const response = await fetch(`https://platform.higgsfield.ai/v1/image2video/dop`, {
    method: "POST",
    headers: {
      'hf-api-key': `${api_key_1}${api_key_2}${api_key_3}`,
      'hf-secret': `${api_key_secret_1}${api_key_secret_2}${api_key_secret_3}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    throw new Error(`Failed to generate video: ${response.statusText}`)
  }
  const data: VideoRecord = await response.json()
  return data
}
type VideoRecord = {
  id: string;
  type: string;
  created_at: string;
  jobs: Array<{
    id: string;
    job_set_type: string;
    status: string;
    results: any | null;
  }>;
  input_params: {
    prompt: string;
    model: string;
    seed: number;
    motions: Array<{
      id: string;
      strength: number;
    }>;
    input_images: Array<{
      type: string;
      image_url: string;
    }>;
    enhance_prompt: boolean;
    check_nsfw: boolean;
  };
}

export const getGenerationResults  = async (job_set_id: string) => {
  const response = await fetch(`https://platform.higgsfield.ai/v1/job-sets/${job_set_id}`, {
    method: "GET",
    headers: {
      'hf-api-key': `${api_key_1}${api_key_2}${api_key_3}`,
      'hf-secret': `${api_key_secret_1}${api_key_secret_2}${api_key_secret_3}`,
    }
  })
  if (!response.ok) {
    throw new Error(`Failed to get generation results: ${response.statusText}`)
  }
  const data: GenerationsResult = await response.json()
  return data
}
type GenerationsResult = {
  id: string;
  type: string;
  created_at: string;
  jobs: Array<{
    id: string;
    job_set_type: string;
    status: 'queued' | 'in_progress' | 'completed' | 'failed';
    results: {
      min?: {
        url: string;
        type: string;
      };
      raw?: {
        url: string;
        type: string;
      };
    } | null;
  }>;
  input_params: {
    prompt: string;
    model: string;
    seed: number;
    motions: Array<{
      id: string;
      strength: number;
    }>;
    input_images: Array<{
      type: string;
      image_url: string;
    }>;
    enhance_prompt: boolean;
    check_nsfw: boolean;
  };
}

export const uploadImageAndGetUrl = async (file: File) => {
  const formData = new FormData()
  formData.append('image_src', file);
  if (WebApp.initDataUnsafe && WebApp.initDataUnsafe.user) {
    formData.append('user', JSON.stringify(WebApp.initDataUnsafe.user))
  }

  const response = await fetch(`https://rasult22.pockethost.io/api/collections/kaizen_images/records`, {
    method: "POST",
    body: formData,
  })
  if (!response.ok) {
    throw new Error(`Failed to upload image: ${response.statusText}`)
  }
  const data: ImageRecord = await response.json()
  const imageUrl = getImageUrl(data.collectionId, data.id, data.image_src)
  return imageUrl
}
type ImageRecord = {
  collectionId: string,
  collectionName: string,
  created: string,
  id: string,
  image_src: string,
  updated: string,
}


const getImageUrl = (collection_id: string, record_id: string, filename: string ) => {
  return `https://rasult22.pockethost.io/api/files/${collection_id}/${record_id}/${filename}`
}

export const generateVideoWithPolling = async (image_url: string, motion_id: string, maxWaitTime: number = 120000): Promise<string> => {
  // Step 1: Generate video
  const videoRecord = await generateVideo(image_url, motion_id);
  const jobSetId = videoRecord.id;
  
  const startTime = Date.now();
  
  // Step 2: Poll for status every second
  while (Date.now() - startTime < maxWaitTime) {
    const result = await getGenerationResults(jobSetId);
    
    // Check if we have jobs and results
    if (result.jobs && result.jobs.length > 0) {
      const job = result.jobs[0];
      
      if (job.status === 'completed') {
        // Check if we have the min URL in results
        if (job.results && job.results.min && job.results.min.url) {
          return job.results.min.url;
        } else {
          throw new Error('Video generation completed but no URL found in results');
        }
      } else if (job.status === 'failed') {
        throw new Error('Video generation failed');
      }
    }
    
    // Wait for 1 second before next check
    await new Promise(resolve => setTimeout(resolve, 4000));
  }
  
  // If we reach here, we've exceeded max wait time
  throw new Error('Video generation timeout exceeded');
}