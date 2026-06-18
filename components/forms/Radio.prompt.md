One-line: Round radio option; group several with a shared `name` for single-choice questions.

```jsx
<Radio name="loss" value="wire" checked={v==='wire'} onChange={()=>setV('wire')} label="Wire transfer" />
<Radio name="loss" value="crypto" checked={v==='crypto'} onChange={()=>setV('crypto')} label="Cryptocurrency" />
```
