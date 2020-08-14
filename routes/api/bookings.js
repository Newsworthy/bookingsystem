const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const moment = require("moment");

// Item model
const Booking = require("../../models/Booking");

// @route GET api/bookings
// @desc GET all bookings
// @access  Public

router.get("/", (req, res) => {
  Booking.find()
    .sort({ date: -1 })
    .then((bookings) => res.json(bookings));
});

// @route POST api/bookings
// @desc Create a POST
// @access  Private

router.post("/", (req, res) => {
  const fixedDate = moment.utc(req.body.date);
  const newBooking = new Booking({
    name: req.body.name,
    bookingDate: fixedDate,
  });
  newBooking.save().then((booking) => res.json(booking));
});

// @route DELETE /api/bookings/:id
// @desc Delete an booking
// @access Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) throw Error("No item found");

    const removed = await booking.remove();
    if (!removed)
      throw Error("Something went wrong while trying to delete the booking");

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

module.exports = router;
