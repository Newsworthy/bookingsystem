const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Create Schema

const BookingSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  requestedDate: {
    type: Date,
    default: Date.now
  },
  bookingDate: {
      type: Date
  }
});

module.exports = Booking = mongoose.model('booking', BookingSchema);
