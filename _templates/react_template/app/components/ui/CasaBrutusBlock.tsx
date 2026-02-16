import React, { useState, type FC } from 'react'

type CasaBrutusBlockProps = {
  className?: string
}

const FONT_SERIF = "'Times New Roman','Georgia',serif"
const FONT_SANS = "'Helvetica Neue','Arial','Hiragino Sans',sans-serif"

export const CasaBrutusBlock: FC<CasaBrutusBlockProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState(0)

  const principles = [
    { num: '01', jp: '読む', en: 'Read', desc: 'すべてを読む。二次的に見えるものも。' },
    { num: '02', jp: '書く', en: 'Write', desc: 'メモを取る。自分の理解を記録する。' },
    { num: '03', jp: '待つ', en: 'Wait', desc: '急がない。持続する速い成功はない。' },
    { num: '04', jp: '作る', en: 'Create', desc: '自分のプロジェクトを作る。興味のあるものを。' },
    { num: '05', jp: '試す', en: 'Try', desc: '実装を試みる。不完全でも理論より勝る。' },
  ]

  const featureCards = [
    {
      num: '01',
      title: '思考の建築',
      en: 'Architecture of Thought',
      desc: '知識の構造を設計する方法論',
    },
    {
      num: '02',
      title: '静寂と集中',
      en: 'Silence and Focus',
      desc: '深い学びのための環境デザイン',
    },
    {
      num: '03',
      title: '余白の美学',
      en: 'Aesthetics of Space',
      desc: '情報過多時代の学習ミニマリズム',
    },
  ]

  return (
    <div
      className={className}
      style={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        fontFamily: FONT_SANS,
        color: '#1a1a1a',
        letterSpacing: '0.02em',
      }}>
      {/* ========== HEADER ========== */}
      <header
        style={{
          padding: '24px 48px',
          borderBottom: '1px solid #e0e0e0',
          background: '#fff',
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1400px',
            margin: '0 auto',
          }}>
          <div
            style={{
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: '#999',
              textTransform: 'uppercase',
            }}>
            Vol. 248 — 2024.12
          </div>
          <div
            style={{
              textAlign: 'center',
            }}>
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '0.4em',
                color: '#999',
                marginBottom: '4px',
                textTransform: 'uppercase',
              }}>
              Magazine for
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 300,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}>
              INFINITY<span style={{ fontWeight: 600 }}>LOOP</span>
            </div>
            <div
              style={{
                fontSize: '9px',
                letterSpacing: '0.3em',
                color: '#666',
                marginTop: '4px',
                textTransform: 'uppercase',
              }}>
              Design of Learning
            </div>
          </div>
          <div
            style={{
              fontSize: '10px',
              letterSpacing: '0.15em',
              color: '#999',
            }}>
            ¥980
          </div>
        </div>
      </header>

      {/* ========== HERO — ARCHITECTURAL ========== */}
      <section
        style={{
          background: '#fff',
          padding: '80px 48px',
          borderBottom: '1px solid #e0e0e0',
        }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1px 1fr',
            gap: '60px',
            alignItems: 'center',
          }}>
          <div>
            <div
              style={{
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: '#999',
                textTransform: 'uppercase',
                marginBottom: '24px',
              }}>
              Special Feature
            </div>
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 300,
                lineHeight: 1.3,
                margin: '0 0 24px 0',
                letterSpacing: '0.05em',
              }}>
              学ぶ、
              <br />
              <span style={{ fontWeight: 600 }}>美しく。</span>
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#666',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                margin: '0 0 32px 0',
              }}>
              The Art of Beautiful Learning
            </p>
            <div
              style={{
                width: '40px',
                height: '1px',
                background: '#1a1a1a',
                marginBottom: '32px',
              }}
            />
            <p
              style={{
                fontSize: '14px',
                lineHeight: 2,
                color: '#666',
                maxWidth: '360px',
              }}>
              これは教科書ではない。ここでは「覚える」のではなく「考える」ことを学ぶ。
              美しいデザインのように、学びにも構造がある。
            </p>
          </div>
          <div
            style={{
              width: '1px',
              height: '300px',
              background: '#e0e0e0',
            }}
          />
          <div
            style={{
              position: 'relative',
            }}>
            <div
              style={{
                width: '100%',
                aspectRatio: '4/3',
                background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
              <div
                style={{
                  width: '200px',
                  height: '200px',
                  border: '1px solid #ccc',
                  borderRadius: '50%',
                  position: 'absolute',
                }}
              />
              <div
                style={{
                  width: '140px',
                  height: '140px',
                  border: '1px solid #999',
                  transform: 'rotate(45deg)',
                  position: 'absolute',
                }}
              />
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  background: '#1a1a1a',
                  borderRadius: '50%',
                }}
              />
            </div>
            <div
              style={{
                marginTop: '16px',
                fontSize: '10px',
                color: '#999',
                letterSpacing: '0.1em',
              }}>
              Fig. 01 — The geometry of understanding
            </div>
          </div>
        </div>
      </section>

      {/* ========== INTRO TEXT ========== */}
      <section
        style={{
          background: '#fff',
          padding: '80px 48px',
        }}>
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
          }}>
          <p
            style={{
              fontSize: '16px',
              lineHeight: 2.2,
              color: '#333',
              textAlign: 'justify',
            }}>
            <span
              style={{
                float: 'left',
                fontSize: '64px',
                lineHeight: 1,
                marginRight: '12px',
                marginTop: '6px',
                fontWeight: 300,
              }}>
              こ
            </span>
            れは教科書ではない。そして参考書でもない。ここでは「すべてを教える」ことを目指していない。
            「順番通りに」学ぶことも求めていない。ただ読んで覚えることを期待していない。これは違う何かだ。
          </p>
          <p
            style={{
              fontSize: '15px',
              lineHeight: 2.2,
              color: '#666',
              marginTop: '32px',
              textAlign: 'justify',
            }}>
            あなたはすでに教科書を見てきた。コースを受講してきた。ビデオを見てきた。
            すべてが分かったような気がした——実際の問題に直面するまでは。
          </p>
          <div
            style={{
              marginTop: '48px',
              paddingTop: '24px',
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <span
              style={{
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: '#999',
                textTransform: 'uppercase',
              }}>
              InfinityLoop Philosophy
            </span>
            <span
              style={{
                fontSize: '10px',
                color: '#ccc',
              }}>
              ―――
            </span>
          </div>
        </div>
      </section>

      {/* ========== 5 PRINCIPLES — GRID ========== */}
      <section
        style={{
          background: '#f5f5f5',
          padding: '80px 48px',
          borderTop: '1px solid #e0e0e0',
          borderBottom: '1px solid #e0e0e0',
        }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '48px',
              paddingBottom: '24px',
              borderBottom: '1px solid #ddd',
            }}>
            <div>
              <div
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.3em',
                  color: '#999',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}>
                Principles
              </div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 300,
                  margin: 0,
                  letterSpacing: '0.1em',
                }}>
                学びの5原則
              </h2>
            </div>
            <div
              style={{
                fontSize: '10px',
                letterSpacing: '0.15em',
                color: '#999',
              }}>
              5 / 5
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '1px',
              background: '#ddd',
            }}>
            {principles.map((item, index) => (
              <div
                key={item.num}
                onMouseEnter={() => setActiveTab(index)}
                style={{
                  background: activeTab === index ? '#1a1a1a' : '#fff',
                  padding: '40px 24px',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  minHeight: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                <div
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    color: activeTab === index ? '#666' : '#ccc',
                    marginBottom: '24px',
                    transition: 'color 0.4s',
                  }}>
                  {item.num}
                </div>
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 300,
                    color: activeTab === index ? '#fff' : '#1a1a1a',
                    marginBottom: '8px',
                    transition: 'color 0.4s',
                    fontFamily: FONT_SERIF,
                  }}>
                  {item.jp}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    color: activeTab === index ? '#888' : '#999',
                    textTransform: 'uppercase',
                    marginBottom: '24px',
                    transition: 'color 0.4s',
                  }}>
                  {item.en}
                </div>
                <div
                  style={{
                    width: '20px',
                    height: '1px',
                    background: activeTab === index ? '#fff' : '#ddd',
                    marginBottom: '24px',
                    transition: 'background 0.4s',
                  }}
                />
                <p
                  style={{
                    fontSize: '12px',
                    lineHeight: 1.8,
                    color: activeTab === index ? '#999' : '#888',
                    margin: 0,
                    marginTop: 'auto',
                    transition: 'color 0.4s',
                  }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== COMPARISON — MINIMAL TABLE ========== */}
      <section
        style={{
          background: '#fff',
          padding: '80px 48px',
        }}>
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
          }}>
          <div
            style={{
              marginBottom: '48px',
            }}>
            <div
              style={{
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: '#999',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
              Comparison
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 300,
                margin: 0,
              }}>
              アプローチの比較
            </h2>
          </div>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid #1a1a1a',
                }}>
                <th
                  style={{
                    padding: '16px 0',
                    textAlign: 'left',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    color: '#999',
                    fontWeight: 'normal',
                    textTransform: 'uppercase',
                    width: '30%',
                  }}>
                  Criteria
                </th>
                <th
                  style={{
                    padding: '16px 0',
                    textAlign: 'center',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    color: '#1a1a1a',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    width: '35%',
                  }}>
                  InfinityLoop
                </th>
                <th
                  style={{
                    padding: '16px 0',
                    textAlign: 'center',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    color: '#999',
                    fontWeight: 'normal',
                    textTransform: 'uppercase',
                    width: '35%',
                  }}>
                  Traditional
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ['学習者の役割', '参加者', '視聴者'],
                ['残るもの', '思考モデル', 'ノート'],
                ['意味の伝え方', '洞察', '情報'],
                ['確認方法', '説明・実践', 'テスト'],
                ['行動', '常に', '時々'],
              ].map(row => (
                <tr
                  key={row[0]}
                  style={{
                    borderBottom: '1px solid #eee',
                  }}>
                  <td
                    style={{
                      padding: '20px 0',
                      fontSize: '13px',
                      color: '#666',
                    }}>
                    {row[0]}
                  </td>
                  <td
                    style={{
                      padding: '20px 0',
                      textAlign: 'center',
                      fontSize: '14px',
                      color: '#1a1a1a',
                      fontWeight: 500,
                    }}>
                    {row[1]}
                  </td>
                  <td
                    style={{
                      padding: '20px 0',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: '#bbb',
                    }}>
                    {row[2]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========== QUOTE — ZEN STYLE ========== */}
      <section
        style={{
          background: '#f5f5f5',
          padding: '120px 48px',
          borderTop: '1px solid #e0e0e0',
          borderBottom: '1px solid #e0e0e0',
        }}>
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center',
          }}>
          <div
            style={{
              width: '1px',
              height: '40px',
              background: '#ccc',
              margin: '0 auto 40px',
            }}
          />
          <blockquote
            style={{
              margin: 0,
            }}>
            <p
              style={{
                fontSize: '24px',
                fontWeight: 300,
                lineHeight: 1.8,
                color: '#1a1a1a',
                margin: '0 0 32px 0',
              }}>
              本当の学びとは、
              <br />
              <span style={{ fontWeight: 500 }}>考え方が変わる</span>こと。
              <br />
              それ以外はすべて、ただの情報だ。
            </p>
            <footer
              style={{
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: '#999',
                textTransform: 'uppercase',
              }}>
              — InfinityLoop Manifesto
            </footer>
          </blockquote>
          <div
            style={{
              width: '1px',
              height: '40px',
              background: '#ccc',
              margin: '40px auto 0',
            }}
          />
        </div>
      </section>

      {/* ========== FEATURE CARDS ========== */}
      <section
        style={{
          background: '#fff',
          padding: '80px 48px',
        }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '48px',
            }}>
            <div>
              <div
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.3em',
                  color: '#999',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}>
                Features
              </div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 300,
                  margin: 0,
                }}>
                特集記事
              </h2>
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
            }}>
            {featureCards.map(card => (
              <div
                key={card.num}
                style={{
                  border: '1px solid #e0e0e0',
                  padding: '32px',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
                onMouseOver={event => {
                  event.currentTarget.style.borderColor = '#1a1a1a'
                  event.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseOut={event => {
                  event.currentTarget.style.borderColor = '#e0e0e0'
                  event.currentTarget.style.transform = 'translateY(0)'
                }}>
                <div
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    color: '#ccc',
                    marginBottom: '24px',
                  }}>
                  {card.num}
                </div>
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    background: '#f5f5f5',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      border: '1px solid #ddd',
                      borderRadius: '50%',
                    }}
                  />
                </div>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 400,
                    margin: '0 0 8px 0',
                  }}>
                  {card.title}
                </h3>
                <div
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    color: '#999',
                    textTransform: 'uppercase',
                    marginBottom: '16px',
                  }}>
                  {card.en}
                </div>
                <p
                  style={{
                    fontSize: '12px',
                    lineHeight: 1.8,
                    color: '#888',
                    margin: 0,
                  }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA — MINIMAL ========== */}
      <section
        style={{
          background: '#1a1a1a',
          padding: '80px 48px',
          textAlign: 'center',
        }}>
        <div
          style={{
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: '#666',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}>
          Start Learning
        </div>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 300,
            color: '#fff',
            margin: '0 0 16px 0',
            letterSpacing: '0.1em',
          }}>
          学びを、始める。
        </h2>
        <p
          style={{
            fontSize: '13px',
            color: '#666',
            marginBottom: '40px',
          }}>
          美しく考える人々のためのプラットフォーム
        </p>
        <button
          type="button"
          style={{
            background: 'transparent',
            color: '#fff',
            border: '1px solid #fff',
            padding: '16px 48px',
            fontSize: '11px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseOver={event => {
            event.currentTarget.style.background = '#fff'
            event.currentTarget.style.color = '#1a1a1a'
          }}
          onMouseOut={event => {
            event.currentTarget.style.background = 'transparent'
            event.currentTarget.style.color = '#fff'
          }}>
          Begin
        </button>
      </section>

      {/* ========== FOOTER — CLEAN ========== */}
      <footer
        style={{
          background: '#fff',
          padding: '40px 48px',
          borderTop: '1px solid #e0e0e0',
        }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <div
            style={{
              fontSize: '14px',
              letterSpacing: '0.2em',
              fontWeight: 300,
            }}>
            INFINITY<span style={{ fontWeight: 600 }}>LOOP</span>
          </div>
          <div
            style={{
              display: 'flex',
              gap: '32px',
            }}>
            {['About', 'Courses', 'Contact'].map(link => (
              <a
                key={link}
                href="#"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  color: '#999',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  transition: 'color 0.2s',
                }}
                onMouseOver={event => {
                  event.currentTarget.style.color = '#1a1a1a'
                }}
                onMouseOut={event => {
                  event.currentTarget.style.color = '#999'
                }}>
                {link}
              </a>
            ))}
          </div>
          <div
            style={{
              fontSize: '10px',
              color: '#ccc',
              letterSpacing: '0.1em',
            }}>
            © 2024 Labs
          </div>
        </div>
      </footer>
    </div>
  )
}
