/* global io, window */
const socket = io();

socket.on("flores.reloadBrowser", () => window.location.reload(true));
