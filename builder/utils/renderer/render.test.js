import { render, execute } from "./index.js"

const echartsChartContent = `\
option = {
    xAxis: {},
    yAxis: {},
    series: [
      {
        symbolSize: 20,
        data: [
          [10.0, 8.04],
          [8.07, 6.95],
          [13.0, 7.58],
          [9.05, 8.81],
          [11.0, 8.33],
          [14.0, 7.66],
          [13.4, 6.81],
          [10.0, 6.33],
          [14.0, 8.96],
          [12.5, 6.82],
          [9.15, 7.2],
          [11.5, 7.2],
          [3.03, 4.23],
          [12.2, 7.83],
          [2.02, 4.47],
          [1.05, 3.33],
          [4.05, 4.96],
          [6.03, 7.24],
          [12.0, 6.26],
          [12.0, 8.84],
          [7.08, 5.82],
          [5.02, 5.68]
        ],
        type: 'scatter'
      }
    ]
  };`

const flowChartContent = `\
st=>start: Start
e=>end
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?:>http://www.google.com
io=>inputoutput: catch something

st->op1->cond
cond(yes)->io->e
cond(no)->sub1(right)->op1`

const sequenceChartContent = `\
title Labyrinth

Bowie -> Goblin: You remind me of the babe
Goblin -> Bowie: What babe?
Bowie -> Goblin: The babe with the power
Goblin -> Bowie: What power?
note right of Bowie, Goblin: Most people get muddled here!
Bowie -> Goblin: "The power of voodoo"
Goblin -> Bowie: "Who-do?"
Bowie -> Goblin: You do!
Goblin -> Bowie: Do what?
Bowie -> Goblin: Remind me of the babe!

Bowie -> Audience: Sings

terminators box`

const ganttChartContent = `\
{
    id: 'Task 1',
    name: 'Do something',
    start: '2024-01-12',
    end: '2024-01-20',
    progress: 50,
},`

const railroadChartContent = `\
Diagram(
	Choice(1, '+', Skip(), '-'),
	Choice(0,
		Sequence(
			OneOrMore(NonTerminal('digit')),
			'.',
			OneOrMore(NonTerminal('digit'))),
		OneOrMore(NonTerminal('digit')),
		Sequence(
			'.',
			OneOrMore(NonTerminal('digit')))),
	Choice(0,
		Skip(),
		Sequence(
			Choice(0, 'e', 'E'),
			Choice(1, '+', Skip(), '-'),
			OneOrMore(NonTerminal('digit')))))`

const katexTestContent = `\
e = mc^2\\\\
\\frac a b = \\frac c d`


let filename
filename = render(echartsChartContent, "echarts")
console.log(filename)
filename = render(flowChartContent, "flowchart")
console.log(filename)
filename = render(sequenceChartContent, "sequence")
console.log(filename)
filename = render(ganttChartContent, "gantt")
console.log(filename)
filename = render(railroadChartContent, "railroad")
console.log(filename)
filename = render(katexTestContent, "katex")
console.log(filename)

execute()
