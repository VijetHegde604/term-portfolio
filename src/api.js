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

export async function fetchCatImage(options = {}) {
  try {
    let url = "https://cataas.com/cat";
    
    // Handle different cat types
    if (options.type === 'gif') {
      url = "https://cataas.com/cat/gif";
    }
    
    // Add text if provided
    if (options.text) {
      const text = encodeURIComponent(options.text);
      if (options.type === 'gif') {
        url = `https://cataas.com/cat/gif/says/${text}`;
      } else if (options.tag) {
        url = `https://cataas.com/cat/${options.tag}/says/${text}`;
      } else {
        url = `https://cataas.com/cat/says/${text}`;
      }
    }
    
    // Add tag if provided
    if (options.tag && !options.text) {
      url = `https://cataas.com/cat/${options.tag}`;
    }
    
    // Add custom parameters
    if (options.width) url += `${url.includes('?') ? '&' : '?'}width=${options.width}`;
    if (options.height) url += `${url.includes('?') ? '&' : '?'}height=${options.height}`;
    if (options.fontSize) url += `${url.includes('?') ? '&' : '?'}fontSize=${options.fontSize}`;
    if (options.fontColor) url += `${url.includes('?') ? '&' : '?'}fontColor=${options.fontColor}`;
    if (options.filter) url += `${url.includes('?') ? '&' : '?'}filter=${options.filter}`;
    
    // Return the URL (will be used to display the image)
    return url;
  } catch (e) {
    return null;
  }
}
