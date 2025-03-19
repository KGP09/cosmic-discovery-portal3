import axios from "axios"

export const getImages = async (req, res) => {
    const { query } = req.body
    try {
        const response = await axios.get(`https://images-api.nasa.gov/search?q=${query}&media_type=image`)
        const items = response.data.collection.items;
        res.status(200).json({ data: items })
    } catch (error) {
        console.log('Get Images Error!');
        res.status(400).json({ message: "Internal Server Error" })
    }
}

export const chatBot = async (req, res) => {
    const { query } = req.body
    try {
        const API_KEY = process.env.MISTRAL_API_KEY
        const API_URL = "https://api.mistral.ai/v1/chat/completions";
        const response = await axios.post(
            API_URL,
            {
                model: "mistral-medium",
                messages: [{ role: "user", content: query }],
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(response.data.choices[0].message.content);
        res.status(200).json({ data: response.data })
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" })
    }
}