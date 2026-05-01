const movieForm = document.getElementById('movieForm');
const resultsElement = document.getElementById('results');
const movieInput = document.getElementById('movieInput');

movieForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Don't use the server to process the form. Continue processing below
    resultsElement.style.display = 'none';
    const movieInputFromUser = movieInput.value.trim();
    // Don't continue if the movie search is missing
    if(!movieInputFromUser) {
        resultsElement.innerHTML = '<p class="bg-yellow-500  p-2 text border-2 rounded-lg">Movie title is required</p>';
        resultsElement.style.display = 'block';
        return;
    }

    try {
        resultsElement.innerHTML = `
            <div class="flex item-center justify-center p-10">
                <i class="fas fa-spinner fa-spin text-4xl mr-4"></i>
                <p class="text-2xl">Loading data...</p>
            </div>
        `;
        resultsElement.style.display = 'block';

        const params = new URLSearchParams({
            search: movieInputFromUser
        });

        const apiUrl = `/movies?${params}`;
        const myApiResponse = await fetch(apiUrl);
        if(myApiResponse.status !== 200) {
            throw new Error(myApiResponse.statusText);
        }
        const data = await myApiResponse.json();
        // console.log(data);
        resultsElement.innerHTML = `
            <h2 id="movieTitle" class="text-xl font-medium mb-5"></h2>
            <div id="moviesParent">
                <div id="moviesSection" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
            </div>
        `;


        // Display movie title
        const movieTitleElement = document.getElementById('movieTitle');
        movieTitleElement.textContent = `You searched for '${movieInputFromUser}'`;

        // Display Movie Data
        const moviesSectionEl = document.getElementById('moviesSection');
        const moviesArr = data.movieData;
        if(moviesArr.length > 0) {
            moviesArr.forEach(movie => {
                const movieCard = `
                    <div class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition transform hover:-translate-y-1">
                        <img src="https://media.themoviedb.org/t/p/w300_and_h450_face${movie.poster_path} || 'https://placehold.co/300x450?text=No+Image'}" alt="${movie.title}" class="w-full h-72 object-cover">
                        <div class="p-4">
                            <h4 class="font-semibold mb-2">${movie.title}</h4>
                            <p class="text-sm text-gray-600 mb-1">${movie.release_date || ''}</p>
                            <p class="text-sm text-gray-600 mb-1">${movie.genres || ''}</p>
                            <p class="text-sm text-gray-600 mb-1">${movie.overview || ''}</p>
                        </div>
                    </div>
                `;
                moviesSectionEl.insertAdjacentHTML('beforeend', movieCard);
            });
        }


    } catch(error) {
        // Display a message when something goes wrong
        resultsElement.innerHTML = `
            <div class="bg-red-200 border border-red-400 text-red-800 rounded-lg p-5 mt-5">
                <h3 class="font-semibold mb-2">Error!</h3>
                <p>Failed to fetch data. Please try again later.</p>
                <p class="text-sm mt-2 text-red-700">${error.message}</p>
            </div>
        `;
    }
})