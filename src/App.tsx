import { useState, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { Urbit } from '@urbit/http-api'
import { renderToString } from 'react-dom/server'
//
import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal';

const defaultString =
`# Start Writing Here

Use markdown to write a file

Use style tags to customize the layout

<style>
  h1 {
    color : red;
  }
</style>`

function App() {
  const [api, setApi] = useState<Urbit>()
  const [markdown, setMarkdown] = useState(defaultString)
  const [fileName, setFileName] = useState('')
  const [bindings, setBindings] = useState<string[]>([])
  const [rescry, setRescry] = useState<any>()
  const [showModal, setShowModal] = useState(false)
  const [toRemove, setToRemove] = useState('')

  useEffect(() => {
    const getApi = async () => {
      const api = await Urbit.authenticate({
        ship : 'zod',
        url: 'http://localhost:80',
        code: 'lidlut-tabwed-pillex-ridrup',
        verbose: false
      })
      setApi(api)
    }
    getApi()
  }, [])

  useEffect(() => {
    if (!api) return
    const getBindings = async () => {
      let res = await api.scry({app: 'blog', path: '/pages'})
      setBindings(res)
    }
    getBindings()
  }, [api, rescry])

  return (
    <Row>
      <Col lg={9}>
        <MDEditor height={730} value={markdown} onChange={setMarkdown as any} data-color-mode="light"/>
      </Col>
      <Col>
        { bindings.length != 0 &&
          <ListGroup as="ul" className="mb-3">
            <label className="form-label">Files</label>
            { bindings.map((bind: string, i) => (
              <ListGroup.Item as="li" key={i} className={`d-flex justify-content-between ${fileName == bind ? 'bg-light' : ''}`}>
                <a href={`${bind}`} target="_blank" rel="noreferrer">{bind}</a>
                <Button variant="warning" onClick={async (e) => {
                  e.preventDefault()
                  if (!api) {
                    console.error('api not connected')
                    return
                  }
                  const res = await api.scry({
                    app: 'blog',
                    path: `/md${bind}`
                  })
                  setFileName(bind)
                  setMarkdown(res)
                }}>
                  Edit
                </Button>
                <Button 
                  variant="danger"
                  onClick={() => { setToRemove(bind); setShowModal(true)}}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
            </ListGroup>
          }
        <Form onSubmit={async (e) => {
          e.preventDefault()
          if (!api) {
            console.error('api not connected')
            return
          }
          const a = await api.poke({
            app: 'blog',
            mark: 'blog-action',
            json: {
              "save-file": {
                // NOTE need a leading slash
                "path": fileName,
                "html": renderToString(<MarkdownPreview source={markdown}/>),
                "md": markdown
          }}})
          setRescry(a)
        }}>
          <Form.Group className="mb-3">
            <Form.Label>File Location</Form.Label>
            <Form.Control
              placeholder="/example/path"
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              pattern="^\/(?!(~.*)|(apps.*)|\/).+"
              required
            />
            <Form.Text className="text-muted">
              The rendered markdown file will be bound to this url path on your ship. /, /~, and /apps are not allowed.
            </Form.Text>
          </Form.Group>
          <Button type="submit" className="w-100 mb-3">Save File</Button>
        </Form>
      </Col>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Body>Are you sure you want to delete {toRemove}? You will not be able to recover it</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={async (e) => {
            e.preventDefault()
            if (!api) {
              console.error('api not connected')
              return
            }
            const a = await api.poke({
              app: 'blog',
              mark: 'blog-action',
              json: { "delete-file": { "path": toRemove } }
            })
            setRescry(a)
            setShowModal(false)
          }}>
            Remove
          </Button>
          {/* <Button variant="primary" onClick={() => {console.log('asdf')}}>
            Remove
          </Button> */}
        </Modal.Footer>
      </Modal>
    </Row>
  );
}

export default App
