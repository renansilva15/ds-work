const { default: axios } = require('axios');
const express = require('express');
const app = express();
const port = 3011;


app.use(express.json());


app.get('/:username', async (req, res) => {
    try {
        const user = req.params.username;
        const options = {
            method: 'GET',
            url: `https://instagram-profile1.p.rapidapi.com/getprofile/${user}`,
            headers: {
                'X-RapidAPI-Key': 'c24d7fed90msh1199fd6783e8023p1ecc44jsn5bc1d186a860',
                'X-RapidAPI-Host': 'instagram-profile1.p.rapidapi.com'
            }
        };
        
        try {
            const response = await axios.request(options);
            if (response.data.status === 'fail') {
                console.log('Usuário não encontrado');
            }else{
                const data = {"Name" : response.data.full_name, "IMG" : response.data.profile_pic_url};
                console.log(data);
                //BD.insert(data);
            }
        } catch (error) {
            console.error(error);
        }
        res.sendStatus(statusCode = 200)
    } catch (error) {
        console.log(error);
    }
});

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});