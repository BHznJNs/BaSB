# Charts

Use three ``!`` symbol to denote a chart.

## QRCode

```markdown
!!!qrcode
Some text
!!!
```
!!!qrcode
Some text
!!!

- - -

## Echarts

References: [https:\/\/echarts.apache.org/examples/zh/index.html](https://echarts.apache.org/examples/zh/index.html)
```markdown
!!!echarts
option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
};
!!!
```
!!!echarts
option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
};
!!!

- - -

## Flow Charts

References: [https:\/\/github.com/adrai/flowchart.js](https://github.com/adrai/flowchart.js)
```markdown
!!!flowchart
st=>start: Start Node
e=>end: End Node
st->e
!!!
```
!!!flowchart
st=>start: Start Node
e=>end: End Node
st->e
!!!

- - -

## Sequence Charts

References: [https:\/\/github.com/davidje13/SequenceDiagram](https://github.com/davidje13/SequenceDiagram)
```markdown
!!!sequence-chart
title "Sequence Chart Example"

甲 -> 乙
乙 -> 甲

terminators box
!!!
```
!!!sequence-chart
title "Sequence Chart Example"

甲 -> 乙
乙 -> 甲

terminators box
!!!

- - -

## Gantt Charts

References: [https:\/\/github.com/frappe/gantt](https://github.com/frappe/gantt)
```markdown
!!!gantt-chart
{
  id: 'Task 1',
  name: 'Task Content',
  start: '2024-02-05',
  end: '2024-02-20',
  progress: 40,
},
{
  id: 'Task 2',
  name: 'Other task content',
  start: '2024-02-08',
  end: '2024-02-23',
  progress: 20,
  dependencies: 'Task 1',
}
!!!
```
!!!gantt-chart
{
  id: 'Task 1',
  name: 'Task Content',
  start: '2024-02-05',
  end: '2024-02-20',
  progress: 40,
},
{
  id: 'Task 2',
  name: 'Other task content',
  start: '2024-02-08',
  end: '2024-02-23',
  progress: 20,
  dependencies: 'Task 1',
}
!!!

- - -

## Railroad Charts

References: [https:\/\/github.com/tabatkins/railroad-diagrams/blob/gh-pages/README-js.md](https://github.com/tabatkins/railroad-diagrams/blob/gh-pages/README-js.md)
```markdown
!!!railroad-chart
Diagram(
  Choice(0,
    NonTerminal("Choice 1"),
    NonTerminal("Choice 2")))
!!!
```
!!!railroad-chart
Diagram(
  Choice(0,
    NonTerminal("Choice 1"),
    NonTerminal("Choice 2")))
!!!

