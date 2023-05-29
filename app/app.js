const d = document,
    $ = (selector) => d.querySelector(selector),
    $form = $('.buscar-form'),
    $section = $('.pokemons-section'),
    $template = d.getElementById('crud-template').content,
    $fragment = d.createDocumentFragment();
    
    
    
    const getPokemon2 = async () => {
    try {

                let res = await axios.get("https://pokeapi.co/api/v2/pokemon?offset=0&limit=151"),
                json = await res.data.results;
        
                // Enviamos todas las solicitudes al mismo tiempo y esperamos a que se resuelvan
                const requests = json.map(el => axios.get(`${el.url}`));
                const responses = await Promise.all(requests);
                const data = responses.map(res2 => res2.data);
        
                data.forEach(pokemon => {
                    const nombrePoke = pokemon.name;
                    const imgPoke = pokemon.sprites.front_default;
                    
                    $template.querySelector('.name').textContent = nombrePoke;
                    $template.querySelector('img').src = imgPoke;
                    $template.querySelector("div").classList.add('pokemon-article');
                    let $clone = d.importNode($template, true);
                    $fragment.appendChild($clone);

                })
                // Añadimos el fragmento a la tabla
                $section.appendChild($fragment);

                d.querySelectorAll('.buscar-tipo button').forEach(el =>{
                    el.disabled = false;
                })
            } catch (err) {
                console.error(err);
            }
        };
        
    d.addEventListener('DOMContentLoaded', getPokemon2);
        
        
    window.addEventListener('click', async e => {
            
        if(e.target.closest('.pokemon-article')){
            e.preventDefault()
            const $pokemon = e.target.closest('.pokemon-article');
    
            console.log($pokemon.querySelector('p').textContent)
            }   
    
        d.querySelectorAll('.buscar-tipo button').forEach(el =>{
            const type = el.dataset.type;
            const type2 = el.textContent;

            if(e.target.closest(`.type-${type}`)){
                d.querySelectorAll('.pokemon-article').forEach( pokemon =>{
                    pokemon.remove()
                })
                burcarPorTipo(type,type2)
            }
        })

        if(e.target.closest('.header nav')){
            e.preventDefault()
            console.log($('.buscar-tipo').classList.toggle('display-none'))
        }

})



    const burcarPorTipo = async (tipo,tipo2) =>{
        d.querySelectorAll('.buscar-tipo button').forEach(el =>{
            el.disabled = true
        })
        $('.allPokemons-title').textContent = `Pokemons de tipo ${tipo2}`   
        let respuestaTipos = await axios.get(`https://pokeapi.co/api/v2/type/${tipo}`),
            jsonTipos = respuestaTipos.data.pokemon;
        
        const requestTipos = jsonTipos.map(el => axios.get(`${el.pokemon.url}`)),
            responsesTipos = await Promise.all(requestTipos),
            dataTipos = responsesTipos.map(responsesTipos => responsesTipos.data)

        dataTipos.forEach(pokemon => {
            const nombrePoke = pokemon.name;
            const imgPoke = pokemon.sprites.front_default || "" ;

            
            $template.querySelector('.name').textContent = nombrePoke;
            $template.querySelector('img').src = imgPoke;
            $template.querySelector("div").classList.add('pokemon-article');
            let $clone = d.importNode($template, true);
            $fragment.appendChild($clone);

        })
        $section.appendChild($fragment);

        d.querySelectorAll('.buscar-tipo button').forEach(el =>{
            el.disabled = false;
        })

    }
