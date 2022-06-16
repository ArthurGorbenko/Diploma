export const normaliseMachineName = name => {
  const n = /\./.test(name) ? name.split('.') : null;
  return n ? n.slice(-1)[0] : name;
};

export const getRenderId = ({machine_name, type}, id) => {
  machine_name = normaliseMachineName(machine_name);

  if (['bg_photo', 'table', 'theme_color'].includes(machine_name)) {
    id = 'image';
  } else if (['bg_text_color'].includes(machine_name)) {
    id = 'color';
  } else if (['boolean', 'image_link', 'video_link'].includes(type)) {
    id = type;
  }

  return id || 'text';
};

export const getImage = (design, machine_name, value) => {
  machine_name = normaliseMachineName(machine_name);

  if (design === 'd2' && machine_name === 'theme_color') {
    value = `bg-title-${value}.jpg`;
  }

  return `/design/${design}/${machine_name}/${value}`;
};
