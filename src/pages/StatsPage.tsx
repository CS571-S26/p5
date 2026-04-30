import React, { useMemo, useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form } from 'react-bootstrap';
import GlobalNavigationBar from './GlobalNavigationBar';

type CompletedGame = {
  seed: number;
  n: number;
  correctCount: number;
  incorrectCount: number;
  timestamp: number;
};

const HISTORY_KEY = 'singleplayer-history-v1';

const StatsPage: React.FC = () => {
  const [history, setHistory] = useState<CompletedGame[]>([]);
  const [filterN, setFilterN] = useState<number | 'all'>('all');

  // load history
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setHistory(parsed);
    } catch {
      setHistory([]);
    }
  }, []);

  // filter data
  const filtered = useMemo(() => {
    if (filterN === 'all') return history;
    return history.filter(g => g.n === filterN);
  }, [history, filterN]);

  // compute average ratio
  const avgRatio = useMemo(() => {
    if (filtered.length === 0) return null;

    let totalCorrect = 0;
    let totalIncorrect = 0;

    filtered.forEach(g => {
      totalCorrect += g.correctCount;
      totalIncorrect += g.incorrectCount;
    });

    if (totalIncorrect === 0) return totalCorrect; // avoid divide by zero

    return totalCorrect / totalIncorrect;
  }, [filtered]);

  return (
    <>
      <GlobalNavigationBar />
      <Container fluid className="d-flex flex-column align-items-center p-4" style={{ maxWidth: 900 }}>
        
        <h1 className="mb-4">Singleplayer Stats</h1>

        {/* Filter */}
        <Card className="w-100 mb-3">
          <Card.Body>
            <Row className="align-items-center">
              <Col xs="auto"><strong>Filter by word count:</strong></Col>
              <Col xs="auto">
                <Form.Select
                  value={filterN}
                  onChange={e => {
                    const val = e.target.value;
                    setFilterN(val === 'all' ? 'all' : Number(val));
                  }}
                >
                  <option value="all">All</option>
                  {[3,4,5,6].map(n => (
                    <option key={n} value={n}>{n} words</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Average Ratio */}
        <Card className="w-100 mb-3">
          <Card.Body>
            <h5>Average Correct : Incorrect</h5>
            {avgRatio === null ? (
              <div>No data</div>
            ) : (
              <div style={{ fontSize: 24, fontWeight: 700 }}>
                {avgRatio.toFixed(2)} : 1
              </div>
            )}
          </Card.Body>
        </Card>

        {/* History List */}
        <Card className="w-100">
          <Card.Body>
            <h5>All Playthroughs</h5>

            {filtered.length === 0 ? (
              <div>No games played yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.slice().reverse().map((g, i) => (
                  <div
                    key={i}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: 6,
                      padding: 10,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#f8f9fa'
                    }}
                  >
                    <div>
                      <div><strong>Seed:</strong> {g.seed}</div>
                      <div><strong>Words:</strong> {g.n}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        {new Date(g.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#155724', fontWeight: 700 }}>
                        ✓ {g.correctCount}
                      </div>
                      <div style={{ color: '#721c24', fontWeight: 700 }}>
                        ✗ {g.incorrectCount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </Card.Body>
        </Card>

      </Container>
    </>
  );
};

export default StatsPage;