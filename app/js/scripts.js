// socket.emit('dc-restart');
socket.on('dashboard', showDashboard);

function formatDate(d) {
  let date = new Date(d);
  let months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'September', 'Oct', 'Nov', 'Dec'
  ];
  let day = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  let hour = date.getHours();
  let minute = date.getMinutes();
  return `${day} ${month} ${year}, ${hour}:${minute}`;
}

// show image information
function showImages(images) {
  let html = '';
  for (let i = 0; i < images.length; i++) {
    if (images[i].names[0] != '<none>:<none>' && images[i].names.length > 0) {
      let names = images[i].names.join(', ');
      let memory = images[i].size/1000000;
      memory = Math.round(memory);
      let date = formatDate(images[i].creation);
      let row = '';
      row += '<tr>';
      row += '<td style="width=70%">' + names + '</td>';
      row += '<td style="width=30%">' + date + '</td>';
      // row += '<td>' + memory + 'MB</td>';
      row += '</tr>';
      html += row;
    }
  }
  $('#images-table-body').html(html);
}

// Show overview information
function showOverview(content) {
  let html = '';
  html += '<p>Images Total: ' + content.images + '</p>';
  html += '<p>Containers Total: ' + content.containers + '</p>';
  html += '<p>Containers Running: ' + content.containersRunning + '</p>';
  html += '<p>Containers Paused: ' + content.containersPaused + '</p>';
  html += '<p>Containers Stopped: ' + content.containersStopped + '</p>';
  $('#overview-content').html(html);
}

// Show system information
function showSystem(content) {
  let html = '';
  let memory = content.mem/1000000;
  let date = formatDate(content.time);
  memory = Math.round(memory);
  html += '<p>OS: ' + content.os + '</p>';
  html += '<p>Docker Version: ' + content.version + '</p>';
  html += '<p>Number of CPUs: ' + content.cpu + '</p>';
  html += '<p>Memory: ' + memory + 'MB</p>';
  html += '<p>Date: ' + date + '</p>';
  $('#system-content').html(html);
}

// Show containers information
function showContainers(content) {
  let html = '';
  for (let i = 0; i < content.length; i++) {
    let memory = content[i].size/1000000;
    memory = Math.round(memory);
    let date = formatDate(content[i].creation);
    let row = '';
    row += '<tr>';
    row += '<td>' + content[i].name + '</td>';
    row += '<td>' + date + '</td>';
    row += '<td>' + content[i].status + '</td>';
    row += '</tr>';
    html += row;
  }
  $('#containers-table-body').html(html);
}

function showDashboard(content) {
  console.log(content);
  showImages(content.images);
  showOverview(content.system);
  showSystem(content.system);
  showContainers(content.containers);
}
