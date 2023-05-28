const d = document,
    $ = (selector) => d.querySelector(selector),
    $form = $('.buscar-form'),
    $section = $('.pokemons-section'),
    $template = d.getElementById('crud-template').content,
    $fragment = d.createDocumentFragment();
    
    
    
    const getPokemon2 = async () => {
    try {
        let res = await axios.get("https://pokeapi.co/api/v2/pokemon?offset=0&limit=100"),
        json = await res.data.results;
        //console.log(json)
        // Enviamos todas las solicitudes al mismo tiempo y esperamos a que se resuelvan
        //console.log(json)
        const requests = json.map(el => axios.get(`${el.url}`));
        //console.log(requests)
        const responses = await Promise.all(requests);
        //console.log(responses)
        const data = responses.map(res2 => res2.data);
        //console.log(data)
        
        // Iteramos sobre los datos para crear los elementos del fragmento
        data.forEach(pokemon => {
            const nombrePoke = pokemon.name;
            const imgPoke = pokemon.sprites.front_default;
            
            $template.querySelector('.name').textContent = nombrePoke;
            $template.querySelector('img').src = imgPoke;
            $template.querySelector("article").classList.add('pokemon-article');
            let $clone = d.importNode($template, true);
            $fragment.appendChild($clone);
        })
        
        // Añadimos el fragmento a la tabla
        $section.appendChild($fragment);
        sexo()
    } catch (err) {
        console.error(err);
    }
};

d.addEventListener('DOMContentLoaded', getPokemon2);


const sexo = async () =>{
    $section.querySelectorAll('.pokemon-article').forEach(el => {

        el.addEventListener('click', async e =>{

            console.log(`${el.querySelector('p').textContent}`)

            let response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${el.querySelector('p').textContent}`),
            json3 = await response.data;
                
            console.log(json3.sprites.other["official-artwork"].front_default)
                
            d.querySelector('.pokemon-nombre').textContent = `name: ${json3.name}`;
            d.querySelector('.pokemon-tipo').textContent = `type: ${json3.types[0].type.name}`;
            d.querySelector('.pokemon-img').src = json3.sprites.other["official-artwork"].front_default;
                
            })
        })
}