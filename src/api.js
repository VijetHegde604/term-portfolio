// api.js

export async function fetchProgrammingJoke() {
  try {
    const res = await fetch(
      "https://v2.jokeapi.dev/joke/Programming?type=single,twopart&safe-mode"
    );
    const data = await res.json();
    if (data.error) return "Could not fetch a joke right now.";
    if (data.type === "single") return data.joke;
    if (data.type === "twopart") return `${data.setup}\n${data.delivery}`;
    return "No joke found.";
  } catch (e) {
    return "Error fetching joke.";
  }
}
