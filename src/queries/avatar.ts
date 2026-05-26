
const api_key_part1 = "sk_V2_";
const api_key_part2 = "hgu_kuBMwAtXRFk_GA7akgCcy7";
const api_key_part3 = "1v1VPX31nztNGuUjE7sedk";
const INTRO_VIDEO_URL_KEY = 'intro_video_url_3'
const INTRO_VIDEO_THUMBNAIL_KEY = 'intro_video_thumbnail_3'
const INTRO_VIDEO_ID_KEY = 'intro_video_id_3'

export const createVideoInvite = async (name: string) => {
  // const API_URL = 'https://api.heygen.com/v2/video/av4/generate'
  const API_URL = 'https://api.heygen.com/v2/video/generate'

  const inputText = `${name}, я очень рад видеть тебя на шестом ежегодном слёте Кайдзен Клуба, который состоится с двадцатого по двадцать второе ноября в Абу-Даби.

Это первый слёт, где AI интегрирован во все процессы — от подготовки до взаимодействия с участниками на месте. 

Надеюсь, что это мероприятие станет точкой роста, где появятся новые идеи, полезные знакомства и ясность в том, как именно технологии могут усилить твой бизнес и жизнь.

До скорой встречи в Абу-Даби!`
  // const paylaod = {
  //   "image_key": "image/65ab414b73114d4280f216fa7980a1ce/original",
  //   "video_title": "Видео-приглашение",
  //   "script": inputText,
  //   "voice_id": "66779a89149040d3b43bdfba1d2d6dc6",
  //   "enhance_custom_motion_prompt": true,
  //   "video_orientation": "portrait"
  // }
  const paylaod = {
      title: "Видео-приглашение",
      video_inputs: [{
        character: {
            type: "avatar",
            avatar_id: "7cb6776f2182458a9f9fd6cc3454b7f2",
            matting: false
        },
        voice: {
            type: "text",
            voice_id :"66779a89149040d3b43bdfba1d2d6dc6",
            input_text: inputText,
            locale: "ru-RU"
        }
      }],
      dimension: {
        width: 720,
        height: 1280
      }
    }
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      "x-api-key": `${api_key_part1}${api_key_part2}${api_key_part3}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paylaod)
  })
  if (response.ok) {
    const data: CreateVideoResponseData = await response.json()

    console.log(data)
    return data;
  }
}

type CreateVideoResponseData = {
    error: string | null,
    data: {
        video_id: string
    }
}

export const getVideoStatus = async (video_id: string) => {
  const response = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${video_id}`, {
    method: 'GET',
    headers: {
      "x-api-key": `${api_key_part1}${api_key_part2}${api_key_part3}`,
      'Content-Type': 'application/json'
    }
  })
  if (response.ok) {
    const data: VideoStatusResponseData = await response.json()

    console.log(data)
    return data;
  }
}
type VideoStatusResponseData = {
  code: 100, 
  data: {
      callback_id: null,
      caption_url: null | string,
      created_at: number,
      duration: number | null,
      error: string | null,
      gif_url: null | string,
      id: string,
      status: "processing" | "completed",
      thumbnail_url: null | string,
      video_url: null | string,
      video_url_caption: null
  },
  message: "Success"
}

export const createVideoInviteAndGetUrls = async (name: string, fire_and_forget: boolean = false): Promise<{ video_url: string; thumbnail_url: string}> => {
  const createRes = await createVideoInvite(name);
  if (!createRes) {
    handleIntroductionVideoError()
    throw new Error('Не удалось создать видео');
  }
  if (createRes.error) {
    handleIntroductionVideoError()
    throw new Error(createRes.error)
  }

  const videoId = createRes.data?.video_id;
  if (!videoId) throw new Error('Видео ID отсутствует');
  localStorage.setItem(INTRO_VIDEO_ID_KEY, createRes.data.video_id)

  if (fire_and_forget) {
    return { video_url: '', thumbnail_url: '' };
  }
  let attempts = 0;

  while (true) {
    const statusRes = await getVideoStatus(videoId);
    if (!statusRes) throw new Error('Не удалось получить статус видео');

    const { status, video_url, thumbnail_url, error } = statusRes.data;

    if (error) {
      throw new Error(error);
    }

    if (status === 'completed' && video_url && thumbnail_url) {
      // save video to localStorage
      localStorage.setItem(INTRO_VIDEO_URL_KEY, video_url);
      localStorage.setItem(INTRO_VIDEO_THUMBNAIL_KEY, thumbnail_url);
      // remove video id from localStorage
      localStorage.removeItem(INTRO_VIDEO_ID_KEY);
      return { video_url, thumbnail_url };
    }
    
    await new Promise((resolve) => setTimeout(resolve, 15000));
    attempts++;
  }
};


// generate videos from user name. Use localStorage for state tracking if app is killed between requests
export const handleIntroductionVideo = async (name: string) => {
  // check if video is ready
  const video_url = localStorage.getItem(INTRO_VIDEO_URL_KEY);
  const thumbnail_url = localStorage.getItem(INTRO_VIDEO_THUMBNAIL_KEY);
  if (video_url && thumbnail_url) {
    return {
      video_url,
      thumbnail_url,
    }
  }

  // check if video generation is already in progress
  const video_id = localStorage.getItem(INTRO_VIDEO_ID_KEY);

  if (video_id) {
    // continue video generation
    return await resumeVideoGeneration(video_id);
  }

  // there no video and no video generation in progress
  // start video generation
  return await createVideoInviteAndGetUrls(name);
}

const resumeVideoGeneration = async (video_id: string) => {
  let attempts = 0;

  while (true) {
    const statusRes = await getVideoStatus(video_id);
    if (!statusRes) throw new Error('Не удалось получить статус видео');

    const { status, video_url, thumbnail_url, error } = statusRes.data;

    if (error) {
      handleIntroductionVideoError()
      throw new Error(error);
    }

    if (status === 'completed' && video_url && thumbnail_url) {
      // save video to localStorage
      localStorage.setItem(INTRO_VIDEO_URL_KEY, video_url);
      localStorage.setItem(INTRO_VIDEO_THUMBNAIL_KEY, thumbnail_url);
      // remove video id from localStorage
      localStorage.removeItem(INTRO_VIDEO_ID_KEY);
      return { video_url, thumbnail_url };
    }
    if (attempts > 2) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
    } else {
      await new Promise((resolve) => setTimeout(resolve, 60000));
    }
    attempts++;
  }
}

const handleIntroductionVideoError = () => {
  // Clear localStorage keys related to video generation
  localStorage.removeItem(INTRO_VIDEO_URL_KEY);
  localStorage.removeItem(INTRO_VIDEO_THUMBNAIL_KEY);
  localStorage.removeItem(INTRO_VIDEO_ID_KEY);
}