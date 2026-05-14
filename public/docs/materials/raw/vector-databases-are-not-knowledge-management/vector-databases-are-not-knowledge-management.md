---
title: Vector Databases Are Not Knowledge Management
author: Dr Stuart Woolley
url: https://medium.com/predict/vector-databases-are-not-knowledge-management-c3d5f4b428ff
fetched: 2026-05-13
lang: en
excerpt: Vector Databases Are Not Knowledge Management Or, at least imho, the
  architectural mistake quietly inflating AI infrastructure budgets. There is a
  category of architectural decision that seems …
---

# Vector Databases Are Not Knowledge Management

Or, at least imho, the architectural mistake quietly inflating AI infrastructure budgets.

![](./assets/01.png)
*“Image generated using OpenAI’s DALL·E.”*

There is a category of architectural decision that seems sensible at the time it is made and indefensible, perhaps even somewhat embarrassing, a few years later, once the constraints that produced it have lifted.

Ok, I know you’re thinking this is all about agile but, that’s apparently a “*process*” rather than an architectural decision. Besides, and unfortunately, management hasn’t realised its embarrassment yet (even though pretty much all developers have), but let’s not get too sidetracked in the first few paragraphs.

I’m actually talking about Retrieval Augmented Generation, or RAG to its friends, and it’s one of these. It was, in its time, the only way to make a useful conversational AI work over a real corpus when context windows were four thousand tokens, and it has been a reasonable patch ever since. It is now, in my opinion (standard disclaimer that everyone will likely ignore) with one million token windows quietly entering production, an infrastructure burden imposed on a problem that no longer meaningfully exists.

## RAG As An Engineering Compensation

The idea was sound enough originally. Embeddings collapse meaning into a vector, vectors can be searched for similarity, and chunks of a corpus can therefore be retrieved on the basis of vague semantic match and stuffed into the model’s tiny working memory before the user’s question lands. The whole stack is, by necessity, balanced on a sequence of delicate alignments, each of which has to hold for the eventual answer to be defensible.

First off, things have to line up. Chunks have to fragment ideas neatly along boundaries the embedding model considered meaningful, which it never quite does, even if you refine, fiddle with, and incestuously use an LLM to do the meaningful filtering.

Secondly, retrieval scores have to surface the chunk that contains the actual answer rather than the dozen chunks that merely sound like the question. Programmatically.

Thirdly, embeddings have to capture the semantic intent the user had in mind, which is itself a contested operationalisation. Again, even if you incestuously use the same (or other, cheaper) LLMs to help with the semantic capture itself. There’s something there that has a whiff of degeneracy too, but we’ve enough to be going on with right now.

And finally, provenance has to survive the journey from chunk back to the model’s synthesis, which it rarely does cleanly. Provenance is also what I like to call circumstantial too, and it only ever as good as the meaning, embedding, retrieval, and may even (yet again) call incestuously on yet another LLM to shoehorn in it meaningfully too.

The entire architecture is conditional on all of these holding in production at once, and the failure modes compound in proportion to the size of the corpus. The point most often missed is that RAG was an engineering compensation for a limitation that was certain to fade.

## The Context Window Effectively “Eats” RAG

Let me just apologise for using the word “*eats*” in this way. I wouldn’t usually, but it fits the hype dismissal nature of this article. Anyway, context windows have done what every technologist watching the curve expected, they have grown by roughly two orders of magnitude in three years. Four thousand became eight, eight became thirty-two, thirty-two became a hundred and twenty-eight, and one million is now quietly available and growing. The cost economics, while still favouring chunked retrieval at the very largest corpora, have completely flipped at the small and medium scale.

Those of us who have been quietly maintaining wikilinked knowledge gardens¹, the [Obsidian](https://obsidian.md/)\-and-markdown crowd, the external prefrontal cortex discipline, have arrived at the unsettling realisation that the LLM can simply read the vault.

No need for embedding, no need for retrieval, no scoring, and no continual re-indexing. The wikilinks are the knowledge graph, the context window is the working memory, and the structure that survives is the structure a human wrote and curated, not the one a model inferred from chunked text against a vector space metric that was never designed for the purpose in the first place.

## The Karpathy Convergence

I built my own setup a while ago, on a working assumption that the model’s context would eventually catch up to the size of my notes, and only later discovered that Andrej Karpathy had independently arrived at almost exactly the same architecture².

Three layers, Raw Sources, Wiki, and Schema. Three operations, Ingest, Query, and Lint. The mirror is direct, almost embarrassingly so. Convergent evolution is always a useful tell. Two people, working alone, arriving at the same shape for the same reason rather suggests that the shape is correct, and that the alternative, the semantically extracted embedding based pseudo-memory, was always a workaround for a defect that has now been patched.

## Where Vector Databases Actually Belong

So where, then, do vector databases belong? Where they originally were, doing something that they were always good at and that no curated markdown vault can ever fill,finding look-alikes in messy, high-cardinality, unstructured event data.

Vector databases are not memory, they are pattern recognition over what may as well be noise. Anomaly correlation, similarity discovery on irregular event streams, the *“what happened the last time this looked like this”* question over a sea of free text log lines and hilariously badly tagged sensor events³.

This is the place where embedding similarity actually pays for itself, because the data is genuinely unstructured by nature and the question is genuinely “find me things like this” rather than “answer me from this question from a manual I ingested”.

I built a test system a while back on exactly this premise⁴, a small architecture that pairs InfluxDB for raw time-series signals with Chroma for the semantic recall layer, tagging detected anomalies with rich metadata and embedding them so that operators of energy assets can ask the look-alike question over years of prior incidents.

It’s a worked example of what vector databases are for, deployed against a problem they are actually good at.

## A Taxonomy That Survives

The taxonomy that emerges from the reframe is pretty straightforward.

-   Stable, human-curated knowledge belongs in linked markdown read directly into the model’s context window.
-   Unstable, web-scale unstructured retrieval still benefits from the old RAG pattern, mostly.  
    And,
-   Anomaly or event stream similarity discovery is the natural cell for vector databases.
-   Factual question answering over stable corpora often warrants fine tuning rather than retrieval at all.
-   And, although I don’t use it myself, I’m theorising that source code search remains a productive niche for embeddings, at least for now. Your comments are welcome.

I believe that the original mistake was treating vector databases as memory. They are not memory, and pretending otherwise has been quietly inflating cost, complexity, and disappointment across the industry for nearly two years.

-   Knowledge wants to be linked, curated, and human-authored.
-   Patterns⁵ wants to be embedded, similarity scored, and machine retrieved.

Mistaking one category for the other is the failure mode baked into a generation of AI architecture decisions, and it is unwinding slowly as the limitations of context windows recede into the rear view mirror.

At least context windows are getting bigger, and thanks to that maybe markdown has finally found its place.

\[1\]: The phrase is mine, but the discipline is not. Niklas Luhmann’s *Zettelkasten* is the canonical antecedent, and many quieter practitioners have arrived independently at variations of the same idea over the decades.  
\[2\]: [Karpathy’s *LLM Wiki*](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) gist describes the architecture in a more compact form than I have here. The convergence is uncanny, but given how it works, unsurprising.  
\[3\]: Well, those are the only kind of logs I’ve ever seen in a production environment anyway.  
\[4\]: Get in touch, if you’re interested. It’s simple but I think to think it’s at least novel.  
\[5\]: That’s pattern as in a pattern and not [Pattern](https://princeofamber.fandom.com/wiki/The_Pattern) as in opposition to [Logrus](https://princeofamber.fandom.com/wiki/The_Logrus), no matter what [Ghostwheel](https://princeofamber.fandom.com/wiki/Ghostwheel) might say when pressed on the matter.
