# Givebutter Frontend Take-home

## Overview

Our goal is to fix and enhance a Pokedex application. If you are unfamiliar with the world of Pokemon, here is a brief explanation:

> The Pokedex is an electronic device created and designed to catalog and provide information regarding the various species of Pokemon featured in the Pokemon video game, anime and manga series.

[Source](https://pokemon.fandom.com/wiki/Pokedex)

Our version of the Pokedex is able to list and search through Pokemon. However, our search is a bit buggy. Additionally, we want to add a feature that shows a selected Pokemon's details like its **type**, **moves**, and **evolution chain**.

Your time is valuable, and we are extremely appreciative of you participating in this assessment. We're looking to gauge your ability to read and edit code, understand instructions, and deliver features, just as you would during your typical day-to-day work. We expect this test to take no more than one to two hours and ask to complete this work within the next two days. Upon submit, we will review and provide feedback to you regardless of our decision to continue the process.

Please update and add code in `App.js` and `index.css` based on the requirements found below. Additionally, we ask you to edit the `readme.md` with answers to a few questions found in the `Follow-up Questions` section also found below.

When you are finished, please upload your completed work to your Github and invite `@gperl27` to view it. **Do not open a PR please.**

## Setup

- This repo was scaffolded using `create-react-app`. As such, this app requires a stable version of `node` to get up and running.
- Clone this repo and run `npm install`.
- To run the app, run `npm start`.
- Please reach out to the Givebutter team if you have any issues with the initial setup or have any problems when running the initial app.

## Requirements

### Search
- Typing in the search input should filter the existing Pokemon list and render only matches found
- Fix any bugs that prevent the search functionality from working correctly
- If there are no results from search, render "No Results Found"
- The search results container should be scrollable
- The UI should match the below mockup

![](mockup0.png)

### Details Card

- Clicking "Get Details" for any given Pokemon should render a card that has the Pokemon's `name`, `types`, `moves`, and `evolution chain`
- Use the api functions defined in `api.js` to retrieve this data. Adding new endpoints or editing existing ones are out of scope
- The details card should match the below mockup

![](mockup1.png)

## Follow-up Questions

Please take some time to answer the following questions. Your answers should go directly in this `readme`.

- Given more time, what would you suggest for improving the performance of this app?

  - One of the biggest bottlenecks, unfortunately, is PokeAPI which seems to not provide a simple way to quickly query our helper `fetchEvolutionChainById` with any data we initially have - such as Pokemon `name` or its `id` (which could potentially be figured out via the full Pokemon set's array index). The ID which the endpoint for `fetchEvolutionById` does not correspond to the Pokemon's ID, rather, it corresponds to the ID of the evolution line itself. This means Bulbasaur and its evolutions are 1, Charmander and its 2, and so on.

    The result of of this is instead of simultaneous queries with only `fetchPokemonDetailsByName` and `fetchEvolutionChainById`, a query must be made for `fetchPokemonSpeciesByName` to retrieve the appropriate PokeAPI endpoint for a Pokemon's evolution line _and then_ we may query the Evolution Chain endpoint.

    PokeAPI could also consider returning more data on the `Details` endpoint or `Species` endpoint to allow only 1 or 2 queries. However, since we don't control this API - any such request would need to go through their GitHub which would take time and potentially not happen at all, depending on their own data structure requirements.

  - For larger datasets, We could consider using an `IntersectionObserver` to unload not-visible DOM nodes for the Pokemon "Get Details" list.

  - We could implement pagination with PokeAPI to query less data initially.

  - When querying Pokemon Details, the parsed result could be cached for future use should the user click the Pokemon again - saving unnecessary queries.

  - Add "Loading" states for Button click and initial Pokemon List fetch

  - Pre-rendering the DOM during build

- Is there anything you would consider doing if we were to go live with this app?

  - `react-scripts` may handle it well, but we would need to consider how well build output is minified for production use, and if not well, find out its appropriate configuration to do so.

  - Definitely get someone to give us a good design (unless this is the approved one, maybe would need to have a discussion with the team)

  - For this app we may want to consider pre-rendering the app for production, which would help with performance and SEO. SSR probably would be overkill and add unnecessary server strain.

  - App is very simple, definitely consider what features could be added with the team.

  - Potentially get better requirements around move display - only first four are shown, but a Pokemon's movepool is extremely diverse and can vary dramatically per-generation.

- What was the most challenging aspect of this work for you (if at all)?

  - Although not necessarily challenging, most time was spent figuring out what data is available to me from each API endpoint and how I can best get everything I need for the "Get Details" display with the least amount of queries / inputs.

     Once I figured out I can't simply pass a Pokemon ID to `fetchEvolutionChainById`, most time was spent seeing if this special ID was available in the Species / Details return for use with the pre-written `fetchEvolutionChainById` util - although I ended up capitulating and just fetching the URL given in the Species return data.

     I would have loved to be able to use only 2 queries instead of 3.
