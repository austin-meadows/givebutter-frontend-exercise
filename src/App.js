import { useEffect, useState } from "react";
import {
    fetchAllPokemon,
    fetchPokemonDetailsByName,
    fetchPokemonSpeciesByName,
} from "./api";

function App() {
    const [pokemonIndex, setPokemonIndex] = useState([])
    const [pokemon, setPokemon] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [pokemonDetails, setPokemonDetails] = useState()

    useEffect(() => {
        const fetchPokemon = async () => {
            const {results: pokemonList} = await fetchAllPokemon()

            setPokemon(pokemonList)
            setPokemonIndex(pokemonList)
        }

        fetchPokemon().then(() => {
            /** noop **/
        })
    }, [])

    const onSearchValueChange = (event) => {
        const value = event.target.value
        setSearchValue(value)

        setPokemon(
            pokemonIndex.filter(monster => monster.name.includes(value))
        )
    }

    const recurseEvolutions = (evolution, arr = []) => {
        arr.push(evolution.species.name);
        if (evolution.evolves_to.length) {
            evolution.evolves_to.forEach(evolution => {
                recurseEvolutions(evolution, arr)
            })
        }
        return arr;
    }

    const onGetDetails = (name) => async () => {
        const fetchDetails = fetchPokemonDetailsByName(name)
        const fetchSpecies = fetchPokemonSpeciesByName(name)
        const [details, species] = await Promise.allSettled([ fetchDetails, fetchSpecies]);

        if (details.status !== 'rejected') {
            // Parse Evolutions
            const evolutions = await fetch(species.value.evolution_chain.url)
                .then(response => response.json())
                .catch(() => null)
            const parsedEvolutions = evolutions?.chain ? recurseEvolutions(evolutions.chain) : [name];

            // Parse Moves
            const MAX_MOVES_LENGTH = 4;
            const parsedMoves = [];
            for (let i = 0; i < MAX_MOVES_LENGTH; i += 1) {
                parsedMoves.push(details.value.moves[i].move.name)
            }

            // Return result
            const parsedResult = {
                evolutions: parsedEvolutions,
                moves: parsedMoves,
                name: details.value.name,
                types: details.value.types.map(({ type }) => type.name),
            }

            setPokemonDetails(parsedResult)
        }
    }

    const renderListItems = (listItems = []) => {
        return listItems.map((item) => <li key={item}>{item}</li>)
    }

    return (
        <div className={'pokedex__container'}>
            <div className={'pokedex__search-input'}>
                <input value={searchValue} onChange={onSearchValueChange} placeholder={'Search Pokemon'}/>
            </div>
            <div className={'pokedex__content'}>
                <div className={'pokedex__search-results'}>
                    { pokemon.length > 0 ?
                        pokemon.map(monster => {
                            return (
                                <div className={'pokedex__list-item'} key={monster.name}>
                                    <div>
                                        {monster.name}
                                    </div>
                                    <button onClick={onGetDetails(monster.name)}>Get Details</button>
                                </div>
                            )
                        })
                        : searchValue && <h2>No Results Found</h2>
                    }
                </div>
                {
                    pokemonDetails && (
                        <div className={'pokedex__details'}>
                            <h3 className={'pokedex__details-heading'}>{pokemonDetails.name}</h3>
                            <div className={'pokedex__details-flex'}>
                                <div className={'pokedex__details-item'}>
                                    <h4 className={'pokedex__details-heading'}>Types</h4>
                                    <ul>
                                    {renderListItems(pokemonDetails.types)}
                                    </ul>
                                </div>
                                <div className={'pokedex__details-item'}>
                                    <h4 className={'pokedex__details-heading'}>Moves</h4>
                                    <ul>
                                    {renderListItems(pokemonDetails.moves)}
                                    </ul>
                                </div>
                            </div>
                            <h4 className={'pokedex__details-heading'}>Evolutions</h4>
                            <ul className={'pokedex__details-flex'}>
                                {renderListItems(pokemonDetails.evolutions)}
                            </ul>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default App;
