seeingthruthefogg.herokuapp.com
https://www.youtube.com/watch?v=mf0Gmdj46Bk&t=4s
github.com/mariamcl/cs171_project

Hello, World and welcome to "Seeing Through the Fogg"!

This project, designed for the course CS171 (Data Visualization at Harvard College in 2016) has been written, groomed, and birthed by Katherine Harrison '19, Maria McLaughlin '18, and Maia Suazo-Maler '19. We've used the data set of the Harvard Art Museums, and have been graciously assisted along the way by Jeff Steward of HAM and members of the CS171 teaching staff. 

Using the HAM data API, Google Geocoding API, sweetalerts, and other libraries listed at the end, we have assembled three key data visualizations: map, timeline, and color. 

There are 6000 pieces in the Harvard Art Museum's collection from 1800 to today.
The Harvard Art Museum, with its vast collection of works, serves as an ideal teaching tool for students, however, its very strength in size presents a daunting task when it comes to visualizing its capabilities. Ever wondered what regions are the root to saturations of art? Curious about how to anchor pieces by time and compare them with one another? Have you ever thought about finding works by their predominant color? Scratch your head no more! Our website presents users with three visual tools to peruse the Harvard Art Museum's collection in an interactive, colorful, and digestible way!

Map plots pieces in our dataset, according to their region of origin, onto a watercolor Leaflet map (to stay in theme, of course) and uses "clusters" to anchor multiple pieces of the same region. All "dots" (representing individual art pieces) are hoverable and clickable, allowing you to view the location and the object specific information, respectively. The clickable functionality, made possible in part by the beauty of Sweet Alerts, allows you to view an image (or lack thereof) of the piece, specific information, and gives you the option to "add to gallery" in order to curate your own selection of pieces you've encountered. The map is zoomable, draggable, and beautiful - if we do say so ourselves. 

Timeline is our dual interaction visualization with a functional brush up top (displaying all the pieces in the collection from 1800 to today as dots along a horizontal line) that controls the responsive, vertically plotted timeline below. The bottom timeline then displays each art piece by date of end creation (for those works that spanned a few years). Since some years were particularly prolific for artists, the dots are stacked vertically to prevent overlap of pieces and allow users to hover over the dots as they grow to distinguish which piece you are looking at. On hover you can see the title and the date, and on click the same Sweet Alert from the map visualization is visible. The brush is also hoverable, allowing you to see the specific date of the pieces you are wanting to look at. Filtering by medium is also available to minimize the amount of pieces in the given time period selected. Color is also used here to categorically seperate works by medium. Add to gallery functionality is also available here. 

Color is our "fun visualization" that extracts the color profile of each piece in our dataset (thanks to the diligent work of members of the DIET Team at HAM). Each piece comes with a thorough color profile that details which percentage of HEX colors are present. In our visualization, those HEX codes have been converted to RGB values and then the predominant color shade is extracted and anchored to the piece - visual by a rectangular strip of said color. The rectangular strips are then amassed together by overarching color (red, orange, yellow, green, and blue in our case) and interactive via a fisheye library that enlarges the bar you are currently hovering over. On click an informative card of the art piece is displayed on the left of the color bar, providing the same information that is present in the Sweet Alerts of the two other visualizations, but not as obtrusive to this visualization in particular - as where you are in the color vis is integral to your personal enjoyment and overall ease of user experience. Add to gallery functionality is also available here. 

The Gallery button up top collects all the pieces you've added through your exploration of art by region, time, and color. The Gallery is linked to the Sweet Alerts, so you can see the detailed information you so fell in love with before, but also is set up to be an overall "lightbox" that allows you to see enlarged photos of the pieces you chose. The Gallery ties all of our visualizations together, and underscores our mission of providing a tool to students to better traverse the vastness of the Harvard Art Museum's collection and engage with it in a visual and innovative way!

Enjoy!

We'd also like to note that the name of our website is merely for the pun of it, as we fully acknowledge the shift in the naming convention from the Fogg Art Museum to the now, overarching, Harvard Art Museums collective. 

Libraries used:
- Bootstrap
- Cluster
- D3, versions 2 and 3, and the fisheye library 
- Google Geocoding API
- HAM API https://github.com/harvardartmuseums/api-docs
- JQuery 
- Leaflet 
- Magnific Pop Up
- Sweet Alert