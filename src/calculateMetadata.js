import fs from 'fs';
import path from 'path';

const readJson = async (filePath) => {
  const data = await fs.promises.readFile(filePath, 'utf-8');
  return JSON.parse(data);
};

export const calculateMetadata = async ({props}) => {
  const publicDir = path.join(process.cwd(), 'public');
  const storyboardPath = path.join(publicDir, 'timeline_storyboard_v1.json');
  const cropPath = path.join(publicDir, 'crop_timeline_1x1.json');

  const storyboard = await readJson(storyboardPath);
  const cropTimeline = await readJson(cropPath);

  const fps = props?.fps ?? 30;
  const maxEnd = Math.max(...storyboard.sections.map((section) => section.end));

  return {
    fps,
    width: 1080,
    height: 1080,
    durationInFrames: Math.ceil(maxEnd * fps),
    props: {
      ...props,
      storyboard,
      cropTimeline,
    },
  };
};
