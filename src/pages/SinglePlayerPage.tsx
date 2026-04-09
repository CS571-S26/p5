import React, { useMemo, useState } from 'react';
import { Container, Card, Row, Col, Button, Badge, Form } from 'react-bootstrap';
import GlobalNavigationBar from './GlobalNavigationBar';

/* Tiny deterministic PRNG (Mulberry32) */
function mulberry32(seed: number) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WORDS = [
  'apple','elephant','truck','kite','eagle','egg','golf','fish','hat','tree',
  'ear','river','rose','sun','night','tiger','rat','top','pear','raven'
];

function generatePuzzle(seed: number, n: number) {
  const rng = mulberry32(seed);
  const out: string[] = [];
  const pickRandom = (arr: string[]) => arr[Math.floor(rng() * arr.length)];
  let first = pickRandom(WORDS);
  out.push(first);
  for (let i = 1; i < n; i++) {
    const prev = out[i - 1];
    const lastChar = prev[prev.length - 1];
    const candidates = WORDS.filter(w => w[0] === lastChar);
    out.push(candidates.length > 0 ? pickRandom(candidates) : pickRandom(WORDS));
  }
  return out;
}

type SavedState = {
  seed: number;
  n: number;
  currentIndex: number;
  revealed: string[];
  guessedForWord: string[]; // for currentIndex only
  correctCount: number;
  incorrectCount: number;
  finished: boolean;
};

const STORAGE_KEY = 'singleplayer-v1';

const SinglePlayerPage: React.FC = () => {
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 1e9));
  const [n, setN] = useState<number>(4);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [letter, setLetter] = useState<string>('');
  const [revealed, setRevealed] = useState<string[]>(() => []);
  const [guessedForWord, setGuessedForWord] = useState<string[]>(() => []);
  const [finished, setFinished] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);

  const puzzle = useMemo(() => generatePuzzle(seed, n), [seed, n]);

  // restore from localStorage on mount
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: SavedState = JSON.parse(raw);
      // basic validation: seed & n exist and puzzle generated from them has same length
      if (typeof parsed.seed === 'number' && typeof parsed.n === 'number' && Array.isArray(parsed.revealed)) {
        const generated = generatePuzzle(parsed.seed, parsed.n);
        if (generated.length === parsed.n) {
          setSeed(parsed.seed);
          setN(parsed.n);
          setCurrentIndex(Math.min(parsed.currentIndex ?? 0, parsed.n - 1));
          setRevealed(parsed.revealed);
          setGuessedForWord(Array.isArray(parsed.guessedForWord) ? parsed.guessedForWord : []);
          setCorrectCount(typeof parsed.correctCount === 'number' ? parsed.correctCount : 0);
          setIncorrectCount(typeof parsed.incorrectCount === 'number' ? parsed.incorrectCount : 0);
          setFinished(Boolean(parsed.finished));
        }
      }
    } catch (err) {
      // ignore malformed storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // initialize revealed when puzzle changes (new seed/n or initial generate) if revealed is empty or lengths mismatch
  React.useEffect(() => {
    if (!revealed || revealed.length !== puzzle.length) {
      setRevealed(puzzle.map((w, idx) =>
        idx === 0 ? w[0] + '_'.repeat(Math.max(0, w.length - 1)) : '_'.repeat(w.length)
      ));
      setCurrentIndex(0);
      setLetter('');
      setFinished(false);
      setCorrectCount(0);
      setIncorrectCount(0);
      setGuessedForWord([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle]);

  // persist relevant state to localStorage whenever it changes
  React.useEffect(() => {
    const toSave: SavedState = {
      seed,
      n,
      currentIndex,
      revealed,
      guessedForWord,
      correctCount,
      incorrectCount,
      finished
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (err) {
      // ignore storage errors (quota etc.)
    }
  }, [seed, n, currentIndex, revealed, guessedForWord, correctCount, incorrectCount, finished]);

  // reset guessedForWord when advancing to a new word
  React.useEffect(() => {
    setGuessedForWord([]);
  }, [currentIndex]);

  const currentWord = puzzle[currentIndex];
  const currentRevealed = revealed[currentIndex] ?? '';

  function submitLetter(e?: React.FormEvent) {
    e?.preventDefault();
    const ch = letter.trim().toLowerCase();
    if (!ch || ch.length !== 1 || !/^[a-z]$/.test(ch)) return;
    if (finished) return;

    // record guess for current word (unique, keep order)
    setGuessedForWord(prev => prev.includes(ch) ? prev : [...prev, ch]);

    // next required letter for current word (first '_' position)
    const nextPos = currentRevealed.indexOf('_');
    if (nextPos === -1) {
      setLetter('');
      return; // already complete
    }

    const required = currentWord[nextPos];
    if (ch === required) {
      setCorrectCount(c => c + 1);
      const updated = currentRevealed.split('').map((c2, i) => i === nextPos ? required : c2).join('');
      setRevealed(prev => {
        const copy = [...prev];
        copy[currentIndex] = updated;
        return copy;
      });

      if (!updated.includes('_')) {
        const nextIndex = currentIndex + 1;
        if (nextIndex >= puzzle.length) {
          setFinished(true);
        } else {
          setCurrentIndex(nextIndex);
        }
      }
    } else {
      setIncorrectCount(c => c + 1);
    }

    setLetter('');
  }

  function newSeed() {
    // clear persisted state for a true new puzzle
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    setSeed(Math.floor(Math.random() * 1e9));
    setRevealed([]);
  }

  return (
    <>
      <GlobalNavigationBar />
      <Container fluid className="d-flex flex-column align-items-center p-4">
        <Card style={{ maxWidth: 900, width: '100%' }}>
          <Card.Body>
            <Row className="align-items-center mb-3">
              <Col>
                <h3>Single Player — Ordered Letters</h3>
                <div><small>Seed: <Badge bg="secondary">{seed}</Badge></small></div>
              </Col>
              <Col xs="auto">
                <Form.Select value={n} onChange={e => { setN(Number(e.target.value)); setRevealed([]); try { localStorage.removeItem(STORAGE_KEY); } catch {} }}>
                  {[3,4,5,6].map(x => <option key={x} value={x}>{x} words</option>)}
                </Form.Select>
              </Col>
              <Col xs="auto">
                <Button variant="outline-primary" onClick={newSeed}>New Seed</Button>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <div className="mb-2"><strong>Current Word ({currentIndex + 1}/{puzzle.length})</strong></div>
                <div style={{ fontSize: 28, letterSpacing: 6, marginBottom: 8 }}>
                  {(currentRevealed || '_'.repeat(currentWord.length)).split('').map((c, i) => (
                    <span key={i} style={{ minWidth: 18, display: 'inline-block', textAlign: 'center' }}>
                      {c === '_' ? '—' : c}
                    </span>
                  ))}
                </div>

                <Form onSubmit={submitLetter} className="d-flex gap-2 align-items-center">
                  <Form.Control
                    placeholder="Enter the next letter"
                    value={letter}
                    onChange={e => setLetter(e.target.value)}
                    maxLength={1}
                    style={{ maxWidth: 160 }}
                    disabled={finished}
                  />
                  <Button type="submit" variant="primary" disabled={finished}>Submit</Button>
                </Form>

                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 12, color: '#333', marginBottom: 4 }}><strong>Guessed letters:</strong></div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(guessedForWord.length === 0)
                      ? <div style={{ color: '#666', fontSize: 13 }}>— none yet —</div>
                      : guessedForWord.map((g, i) => (
                          <div key={i} style={{
                            padding: '6px 8px',
                            borderRadius: 6,
                            border: '1px solid #ddd',
                            background: currentWord.includes(g) ? '#e2f0d9' : '#f8d7da',
                            color: currentWord.includes(g) ? '#155724' : '#721c24',
                            fontWeight: 700,
                            minWidth: 22,
                            textAlign: 'center'
                          }}>{g}</div>
                        ))
                    }
                  </div>
                </div>

              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <div className="mb-2"><strong>Puzzle Words</strong></div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {puzzle.map((w, i) => (
                    <div key={i} style={{
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: 4,
                      minWidth: 120,
                      textAlign: 'center',
                      background: i < currentIndex ? '#d4edda' : (i === currentIndex ? '#fff3cd' : '#f8f9fa')
                    }}>
                      <div style={{ fontWeight: 600 }}>{revealed[i] ?? '_'.repeat(w.length)}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>{i === currentIndex ? `current (#${i+1})` : `#${i + 1}`}</div>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <small className="text-muted">
                  Guess letters in order: only the next unrevealed letter for the current word is accepted.
                </small>
                {finished && <div style={{ marginTop: 8 }}><Badge bg="success">All words complete</Badge></div>}
              </Col>
            </Row>

            <hr />

            <Row className="align-items-center">
              <Col xs="auto">
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{
                    background: '#d4edda',
                    color: '#155724',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #c3e6cb',
                    minWidth: 88,
                    textAlign: 'center',
                    fontWeight: 700
                  }}>
                    Correct: {correctCount}
                  </div>
                  <div style={{
                    background: '#f8d7da',
                    color: '#721c24',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #f5c6cb',
                    minWidth: 88,
                    textAlign: 'center',
                    fontWeight: 700
                  }}>
                    Incorrect: {incorrectCount}
                  </div>
                </div>
              </Col>
            </Row>

          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default SinglePlayerPage;
<i>oi</i>