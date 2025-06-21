require('dotenv').config({ path: './src/config/.env' });
const http = require('http');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initSocket } = require('./sockets');

