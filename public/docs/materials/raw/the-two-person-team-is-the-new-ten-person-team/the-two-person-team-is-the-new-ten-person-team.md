---
title: The two-person team is the new ten-person team
author: Matt Whetton
url: https://medium.com/@mattwhetton/the-two-person-team-is-the-new-ten-person-team-a579e353b802
fetched: 2026-05-13
lang: en
excerpt: The two-person team is the new ten-person team I have run an
  engineering team of 120 people. I now run engineering at two companies at
  once. One has 19 engineers, organised into product and platform …
---

# The two-person team is the new ten-person team

I have run an engineering team of 120 people. I now run engineering at two companies at once. One has 19 engineers, organised into product and platform teams of two or three. At the other, the whole engineering function is two people.

In both cases the working unit is the small team. Not as a starting point that will grow into something bigger, but as the shape the work is done in. The two-or-three-person team is not a smaller version of a ten-person team, and a ten-person team is not a smaller version of a hundred-person team. They are structurally different things. Treating them as points on the same line, with the small one as a stopgap on the way to the big one, is the mistake I see most often when people talk about team size in 2026.

I want to make the case for the small team on its own terms. Not as scrappy, not as temporary, not as something to apologise for. As the right shape for the work, when the work fits.

## What the small team is actually good at

The easy answer is communication. Two people can hold the whole system in their heads. Decisions are made in minutes rather than meetings. Knowledge transfers as a side effect of working together rather than as a documented process. That is all true and it matters, but it is not the thing that makes the small team work.

The thing that makes the small team work is agency.

In most organisations of any size, autonomy is something the leadership talks about but the teams do not actually have. Either the decisions are quietly made above them and handed down with the appearance of consultation, or the team has been given autonomy on paper but does not take it, because the cultural signals say someone else will sign off in the end. Either way, the team is not really making the calls.

A two-person team cannot operate that way. There is nowhere for the decision to go. You make the call, or nothing happens. And once that has been true for long enough, you stop looking upward for permission. The team becomes the place where the answer comes from, not the place where the answer is implemented.

In the two-person team we have not compromised on this. The two engineers are the people who decide how the system is built, what gets prioritised, what gets deferred, what is good enough. They are not waiting for me, and they are not waiting for the CEO. That is the part most setups get wrong, and it is the part that makes the team work.

By contrast, in the 120-person organisation, agency was a thing we worked at constantly and never fully solved. Squads had owners, owners had remits, remits had boundaries, and boundaries had escalation paths. None of that was wrong. At that scale you need it. But the cost is that the agency itself becomes a managed resource rather than a default behaviour, and a meaningful amount of engineering energy goes into negotiating the boundaries rather than working inside them.

![](./assets/01.png)
*Agency, when there is no one else to escalate to*

## What the small team cannot do

The two-person team makes tactical decisions every week about things that do not present immediate value. The clearest example is data subject access requests. We would like the whole process automated end to end. The volume does not justify it. So we serve them manually for now, and we will keep serving them manually until the volume tells us otherwise. A larger team would have built the automation already, probably as part of a broader compliance workstream that nobody specifically asked for but which made sense given the headcount.

That is the deal. There are categories of work that simply sit in a queue, and the queue is honest. Nobody is pretending it will be picked up next quarter.

The thing I have become firmer about, running the small team, is that you have to automate aggressively and early when the thing being wasted is engineering time. Engineering time is the precious resource in a two-person team. Anything that erodes it without producing proportionate value has to go, and it has to go fast. The discipline is not in deciding what to build. It is in deciding what not to.

The other cost is harder to engineer around. A two-person team is two single points of failure. If one engineer leaves, you have lost half the team and most of the working knowledge of part of the system. Succession planning in the conventional sense does not exist. There is no bench, there is no shadow, there is no graceful handover to the next person in the rotation, because there is no next person.

You can take some of the edge off. Write things down. Keep the system small enough that a new engineer can be productive in weeks rather than months. Use AI tooling to make the codebase legible to someone arriving cold, because a system that can be re-read and re-understood quickly is less dependent on the person who built it. None of that removes the risk. It softens the landing if the risk lands. You are accepting a higher variance in exchange for the things the small team gives you, and you have to be willing to take the variance honestly.

## What AI actually changes

![](./assets/02.png)
*AI changes reach, not throughput.*

Most writing on AI and small teams reaches for a throughput claim. AI makes engineers faster, therefore the small team can do the work of a larger one. I do not find that framing useful. It is the wrong shape of claim, and it understates what is happening.

For a two-person team, coordination cost is already close to zero. There is no throughput multiplier to chase by removing meetings or shortening review cycles, because those costs were never the constraint. What AI changes is reach. It extends the team into territory it previously had to ignore or outsource.

The concrete example is the data pipeline. We do not have a data engineer. We are not modelling a warehouse. But we have built and run an automated pipeline into BigQuery, with transformations in dbt, and it is good enough for what the business needs. It is not the most sophisticated thing I have ever seen. It exists, it runs, and the two engineers own it. Two years ago that work would have been outsourced, deferred, or done badly in a spreadsheet. It is now inside the team’s reach.

That is the pattern. AI lets the small team hold ground it would previously have ceded. Ops work, infrastructure, internal tooling, documentation, the long tail of things that historically required either a specialist or a bigger team to absorb. None of this makes two engineers into ten. It does make two engineers into a team that can credibly own a much wider surface.

## Why this is not a stopgap

The natural assumption is that the two-person team is the early phase of a bigger team, and the question is when to hire. I do not think about it that way. The team is the answer to the work, not a placeholder for a future team that will be the real answer.

This does not generalise to all work or all businesses. There are products that genuinely require ten or twenty or a hundred engineers, because the surface area of the problem is irreducible and the work cannot be sequenced down. I have run those teams. They are not failures of focus. They are the right shape for what they are doing.

But there is a category of work, and a category of business, where the two-person team is the right shape and stays the right shape. Products with a coherent core, a clear set of users, and a roadmap that benefits from continuity more than from parallelism. Businesses where the cost of fragmentation is higher than the cost of slower throughput on the long tail. That is the territory where I would actively choose the small team rather than tolerate it.

## Where I land

I am no longer waiting to hire out of the two-person team. The team is what the work needs. Hiring would not make the product better. It would make it more like every other product, built by every other team, with the coherence diluted across more heads.

Running both at once has clarified something I did not see when I was running 120 people. Team size is not a measure of seriousness or ambition. It is a design choice. The two-person team, the three-person product team, the hundred-person engineering organisation are different instruments, suited to different work. The skill is in knowing which instrument the work requires, and being willing to stay there once you have chosen. In both companies I run now, the instrument is the small team, and it is the answer rather than the prelude.
