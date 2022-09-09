import GodHeader from '../mainGodPage/GodHeader';

export default function ItemPage(props: { item: string }) {
  return (
    <div className='Godpage'>
      <div className='container'>
        <div className='god-container build_page'>
          <div className='row align-items-center my-5'>
            {/* <div class="col-lg-5"></div> */}
            <h1 className='font-weight-light'></h1>

            <GodHeader
              god={props.item}
              url={'url'}
              tier={'tier'}
              role={'role'}
              rank={'rank'}
              abilities={'abilities'}
              patch={'patch'}
              tab={'tab'}
              mode={'mode'}
              queueType={'queueType'}
            />
            {/* <Filter
              mode={mode}
              role={role}
              god={pagegod}
              queueType={queueType}
              rank={rank}
              patch={patch}
              matchup={matchup}
              modeFilters={modes}
              patchFilters={patches}
              roleFilters={roles}
              rankFilters={ranks}
              queueFilters={queueTypes}
              routes={routes}
              setRank={setRank}
              setRole={setRole}
              setPatch={setPatch}
              setMode={setMode}
              setMatchup={setMatchup}
              setQueueType={setQueueType}
            />
            <BasicTabs
              changeTab={setTab}
              winRate={winrate}
              pickRate={pickrate}
              banRate={banrate}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
