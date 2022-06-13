import TierListTabs from '../Tabs/TierListTabs';
import TierList from './TierList';
import CombatTierList from './CombatTierList';
import ObjectiveTierList from './ObjectiveTierList';
import DuoLaneTierList from './DuoLaneTierList';
import { useState, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { TierListContext } from './TierListContext';
import JoustTriosTierList from './JoustTriosTierList';

export default function TierListPage() {
  const [tableType, setTableType] = useState('Regular');
  const [
    god,
    setGod,
    queueType,
    setQueueType,
    patch,
    setPatch,
    rank,
    setRank,
    role,
    setRole,
    topLink,
    setTopLink,
    mode,
    setMode,
  ] = useContext(TierListContext);
  const [totalData, setTotalData] = useState([]);

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>{`SMITE ${tableType} Tier List for ${patch}`}</title>
      </Helmet>
      <div id='page-content'>
        <div style={{ width: '100%' }}>
          <div id='main-content' className='collapsed'>
            <div id='content-wrapper'>
              <div id='content'>
                <div className='content-side-padding background-image-container'>
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <div className='bg-container'>
                      <img className='background-image' src={topLink} />
                    </div>
                    <div className='gradient-container'>
                      <div className='gradient'></div>
                    </div>
                  </div>
                </div>
                <div className='stats-tables-page'>
                  <div
                    id='stats-tables-container-ID'
                    className='stats-tables-container content-side-padding'
                    style={{ paddingTop: '100px' }}
                  >
                    <div className='title-header'>
                      <h1 className='tier-list'>
                        <span className='title-header_main'>
                          <h2 className='god-label'>
                            <span>
                              <b style={{ color: 'white' }}>
                                {tableType} Stats Tier List
                              </b>
                            </span>
                            <span>&nbsp;for SMITE patch {patch}</span>
                            <span>
                              &nbsp;{rank}, {role}
                            </span>
                          </h2>
                        </span>
                        {/* <span className="title-header_secondary">for {role}, {dispRank.replaceAll("_", " ")}</span> */}
                      </h1>
                    </div>
                    <TierListTabs
                      style={{ paddingTop: '10px' }}
                      changeTableType={setTableType}
                      tab={'Regular'}
                    >
                      <div data-label='Regular' style={{ color: 'white' }}>
                        <TierList tableType={'Regular'} data={totalData} />
                      </div>
                      <div data-label='Combat' style={{ color: 'white' }}>
                        <TierList tableType={'Combat'} data={totalData} />
                      </div>
                      <div data-label='Objective' style={{ color: 'white' }}>
                        <ObjectiveTierList
                          tableType={'Objective'}
                          data={totalData}
                        />
                      </div>
                      <div data-label='Duos' style={{ color: 'white' }}>
                        <DuoLaneTierList tableType={'Duos'} />
                      </div>
                      <div data-label='Joust Trios' style={{ color: 'white' }}>
                        <JoustTriosTierList tableType={'Trios'} />
                      </div>
                    </TierListTabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
