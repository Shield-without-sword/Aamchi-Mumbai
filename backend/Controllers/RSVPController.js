const RSVPResponse = require("../Models/RSVP");

const createRSVPResponse = async (req, res) => {
    try {
        const { eventId, name, email, phone, response } = req.body;
        
        // Create new RSVP response
        const rsvp = new RSVPResponse({
            eventId,
            name,
            email,
            phone,
            response
        });
        
        await rsvp.save();
        
        res.status(201).json({
            message: 'RSVP response recorded successfully',
            success: true,
            data: rsvp
        });
    } catch (err) {
        console.log('Error ', err);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error: err.message
        });
    }
};

const getAllRSVPs = async (req, res) => {
    try {
        let { page, limit, search } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 5;
        const skip = (page - 1) * limit;

        let searchCriteria = {};
        if (search) {
            searchCriteria = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const totalRSVPs = await RSVPResponse.countDocuments(searchCriteria);
        const rsvps = await RSVPResponse.find(searchCriteria)
            .populate('eventId', 'name startAt endAt')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalPages = Math.ceil(totalRSVPs / limit);

        res.status(200).json({
            message: 'All RSVPs',
            success: true,
            data: {
                rsvps,
                pagination: {
                    totalRSVPs,
                    currentPage: page,
                    totalPages,
                    pageSize: limit
                }
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error: err
        });
    }
};

// ✅ **EXPORT THE MISSING FUNCTION**
module.exports = {
    createRSVPResponse,
    getAllRSVPs,
};