export const defaultString =
`# Welcome to \`%blog\`

![sigils](https://media.urbit.org/site/understanding-urbit/urbit-id/urbit-id-sigils%402x.png)

Use markdown to write a file. If you don't know how to write markdown, go through [this](https://www.markdowntutorial.com/), it's easy.
To bind a post to a URL, just type in the path on the right and click \`%save-file\`. You post will instantly be viewable from the browser. For example, if your ships's domain is \`https://sampel-palnet.urbit.org\`, and you type in \`/blog/1\`, you will be able to see your blog at \`https://sampel-palnet.urbit.org/blog/1\`. Try it now and you will see this post served from your ship!

## Notes on \`<style>\`
- Use \`<style>\` tags to customize the layout.
- if you do not know CSS, either:
  - learn how [here](https://www.w3schools.com/css/), or 
  - ask ChatGPT to "write me a style sheet for markdown" and it'll know what to do
- Until further notice, styling is a little wonky: 
- The editor and the document share a style sheet. This screws up the editors styling, so if you e.g. add \`body : { margin : 10rem }\` to the style sheet below, everything will get screwy
  - To avoid this, add \`.wmde-markdown\` in front of all styles to keep them from propogating, as I have done below
  - This is a bug that I'll fix at some point


## Features Coming Soon
- "follow" a ship for new blog posts
- comments
- sharable themes
- drafts

For any feature requests, make an issue or a PR into [here](https://github.com/tadad/blog-ui/issues) for the UI repo, or [here](https://github.com/tadad/blog/issues) for the hoon code.

Happy blogging!

\`~dachus-tiprel\`

<style>
.wmde-markdown h1, h2, h3, h4, h5, h6 {
    color : black;
    text-align: center;
}
.wmde-markdown img {
    margin: auto;
    max-height: 300px;
    display: block;
}
.wmde-markdown {
    margin : 7vw;
    font-size : 3vh;
    color: #393939
}
</style>
`