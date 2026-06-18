One-line: Centered modal over a navy scrim, with title, description, body, and an actions footer.

```jsx
<Dialog open={open} onClose={close}
  title="Confirm document submission"
  description="This will be added to your case file."
  footer={<><Button variant="ghost" onClick={close}>Cancel</Button><Button onClick={submit}>Submit</Button></>}>
  Your bank statement (PDF, 240 KB) is ready to upload.
</Dialog>
```
Click-scrim and the × both call `onClose`.
