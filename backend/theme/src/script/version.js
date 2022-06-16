const {origin, search} = location;
const credentials = new URLSearchParams(search);
const uuid = credentials.get('uuid');
const slideshowId = credentials.get('slideshow_id');
const {version} = app.datas;

const checkVersion = () => {
  fetch(`${origin}/api/version/${uuid}/${slideshowId}`)
    .then(res => {
      if (res.ok && res.status < 203) {
        return res.json();
      }
    })
    .then(({version: newVersion}) => newVersion != version && location.reload(true));
};

if (uuid && slideshowId) {
  setInterval(checkVersion, 5000);
}
