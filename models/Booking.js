const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Create Schema

const BookingSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  bookerId: {
      type: String,
      required: true
  },
  requestSection: {
      type: String,
      required: true,
      enum: [
          "barbell",
          "machines"
      ],
  },
  requestedDate: {
    type: Date,
    default: Date.now
  },
  duation: {
      type: Number,
      default: 90
  },
  bookingDate: {
    type: Date
  }
});

module.exports = Booking = mongoose.model('booking', BookingSchema);
