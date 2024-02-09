import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  TECollapse,
  TEInput,
  TETabs,
  TETabsContent,
  TETabsItem,
  TETabsPane,
  TETextarea,
} from "tw-elements-react"

import './App.css'

import WebRenderer from '@wharfkit/web-renderer';
import SessionKit, { Session } from '@wharfkit/session';
import { WalletPluginAnchor } from '@wharfkit/wallet-plugin-anchor'
import { WalletPluginWebAuth } from "../../"

const webRenderer = new WebRenderer()

const sessionKit = new SessionKit({
  appName: "nftwatchdao",
  chains: [
    {
      id: "384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0",
      url: "https://proton.eosusa.io",
    },
  ],
  ui: webRenderer,
  walletPlugins: [
    new WalletPluginWebAuth(),
    new WalletPluginAnchor()
  ],
})

function App() {
  const [sess, setSession] = useState<Session | undefined>(undefined)

  // addblacklist
  const [toBlacklist, setToBlacklist] = useState<string>('')
  const [blacklistComment, setBlacklistComment] = useState<string>('')
  const handleToBlacklist = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setToBlacklist(event.currentTarget.value);
  }
  const handleBlacklistComment = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setBlacklistComment(event.currentTarget.value);
  }

  // addshielding
  const [colToShield, setColToShield] = useState<string>('')
  const [reportCidToShield, setReportCidToShield] = useState<string>('')
  const [skipReasonToShield, setSkipReasonToShield] = useState<string>('')
  const handleColToShield = (event: React.FormEvent<HTMLInputElement>) => {
    setColToShield(event.currentTarget.value);
  }
  const handleReportCidToShield = (event: React.FormEvent<HTMLInputElement>) => {
    setReportCidToShield(event.currentTarget.value);
  }
  const handleSkipReasonToShield = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setSkipReasonToShield(event.currentTarget.value);
  }

  // confirmrep
  const [toConfirmBlacklist, setToConfirmBlacklist] = useState<string>('')
  const [confirmBlacklistComment, setConfirmBlacklistComment] = useState<string>('')
  const handleToConfirmBlacklist = (event: React.FormEvent<HTMLInputElement>) => {
    setToConfirmBlacklist(event.currentTarget.value);
  }
  const handleConfirmBlacklistComment = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setConfirmBlacklistComment(event.currentTarget.value);
  }

  // rejectreport
  const [colToRejectReport, setColToRejectReport] = useState<string>('')
  const [rejectBlacklistComment, setRejectBlacklistComment] = useState<string>('')
  const handleColToRejectReport = (event: React.FormEvent<HTMLInputElement>) => {
    setColToRejectReport(event.currentTarget.value);
  }
  const handleRejectBlacklistComment = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setRejectBlacklistComment(event.currentTarget.value);
  }

  // confshield
  const [colToConfirmShield, setColToConfirmShield] = useState<string>('')
  const [confirmShieldReportCid, setConfirmShieldReportCid] = useState<string>('')
  const handleColToConfirmShield = (event: React.FormEvent<HTMLInputElement>) => {
    setColToConfirmShield(event.currentTarget.value);
  }
  const handleConfirmShieldReportCid = (event: React.FormEvent<HTMLInputElement>) => {
    setConfirmShieldReportCid(event.currentTarget.value);
  }

  // rejectshield
  const [colToRejectShield, setColToRejectShield] = useState<string>('')
  const [rejectShieldReportCid, setRejectShieldReportCid] = useState<string>('')
  const handleColToRejectShield = (event: React.FormEvent<HTMLInputElement>) => {
    setColToRejectShield(event.currentTarget.value);
  }
  const handleRejectShieldReportCid = (event: React.FormEvent<HTMLInputElement>) => {
    setRejectShieldReportCid(event.currentTarget.value);
  }

  // report
  const [colToReport, setColToReport] = useState<string>('')
  const [reportReason, setReportReason] = useState<string>('')
  const handleColToReport = (event: React.FormEvent<HTMLInputElement>) => {
    setColToReport(event.currentTarget.value);
  }
  const handleReportReason = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setReportReason(event.currentTarget.value);
  }

  // reqshielding
  const [colToReqShield, setColToReqShield] = useState<string>('')
  const [skipBasicCheck, setSkipBasicCheck] = useState<boolean>(false)
  const [skipReasonToReqShield, setSkipReasonToReqShield] = useState<string>('')
  const handleColToReqShield = (event: React.FormEvent<HTMLInputElement>) => {
    setColToReqShield(event.currentTarget.value);
  }
  const handleSkipBasicCheck = (event: React.FormEvent<any>) => {
    setSkipBasicCheck(event.currentTarget.checked);
    if(!event.currentTarget.checked) {
      setSkipReasonToReqShield('')
    }
  }
  const handleSkipReasonToReqShield = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setSkipReasonToReqShield(event.currentTarget.value);
  }

  // tabs & accordion
  const [basicActive, setBasicActive] = useState("community-actions");
  const [activeAction, setActiveAction] = useState("");
  const handleActionAccordionClick = (value: string) => {
    if (value === activeAction) {
      setActiveAction("");
    } else {
      setActiveAction(value);
    }
  };
  const handleBasicClick = (value: string) => {
    if (value === basicActive) {
      return;
    }
    setBasicActive(value);
  };

  // wallet connection & contract actions
  useEffect(() => {
    const restoreSession = async () => {
      const session = await sessionKit.restore()
      setSession(session);
    }
    restoreSession().catch(console.error);
  }, [])

  async function login() {
    const { session } = await sessionKit.login()
    setSession(session)
  }

  async function logout() {
    if(sess) {
      await sessionKit.logout()
      setSession(undefined);
    }
  }

  const actorName = useMemo(() => {
    return sess ? sess.actor.toString() : ''
  }, [sess])
  
  async function doBlacklist() {
    if(sess) {
      const actions = []
      const collections = toBlacklist.split(',')
      for (let i=0; i<collections.length; i++) {
        actions.push({
          account: "nftwatchdao",
          name: "addblacklist",
          authorization: [sess.permissionLevel],
          data: {
            collection: collections[i],
            guard: sess.actor,
            comment: blacklistComment,
          },
        })
      }
      await sess.transact({ actions }, { broadcast: true })
    }
  }

  async function doShield() {
    if(sess) {
      const action = {
        account: "nftwatchdao",
        name: "addshielding",
        authorization: [sess.permissionLevel],
        data: {
          collection: colToShield,
          guard: sess.actor,
          skipReason: skipReasonToShield,
          reportCid: reportCidToShield
        },
      }
      await sess.transact({ action }, { broadcast: true })
    }
  }

  async function doConfirmBlacklisting() {
    if(sess) {
      const action = {
        account: "nftwatchdao",
        name: "confirmrep",
        authorization: [sess.permissionLevel],
        data: {
          collection: toConfirmBlacklist,
          guard: sess.actor,
          comment: confirmBlacklistComment
        },
      }
      await sess.transact({ action }, { broadcast: true })
    }
  }

  async function doRejectBlacklisting() {
    if(sess) {
      const action = {
        account: "nftwatchdao",
        name: "rejectreport",
        authorization: [sess.permissionLevel],
        data: {
          collection: colToRejectReport,
          guard: sess.actor,
          comment: rejectBlacklistComment
        },
      }
      await sess.transact({ action }, { broadcast: true })
    }
  }

  async function doConfirmShielding() {
    if(sess) {
      const action = {
        account: "nftwatchdao",
        name: "confshield",
        authorization: [sess.permissionLevel],
        data: {
          collection: colToConfirmShield,
          guard: sess.actor,
          reportCid: confirmShieldReportCid
        },
      }
      await sess.transact({ action }, { broadcast: true })
    }
  }

  async function doRejectShielding() {
    if(sess) {
      const action = {
        account: "nftwatchdao",
        name: "rejectshield",
        authorization: [sess.permissionLevel],
        data: {
          collection: colToRejectShield,
          guard: sess.actor,
          reportCid: rejectShieldReportCid
        },
      }
      await sess.transact({ action }, { broadcast: true })
    }
  }

  async function doReport() {
    if(sess) {
      const action = {
        account: "nftwatchdao",
        name: "report",
        authorization: [sess.permissionLevel],
        data: {
          collection: colToReport,
          reporter: sess.actor,
          reason: reportReason
        },
      }
      await sess.transact({ action }, { broadcast: true })
    }
  }

  async function doRequestShield() {
    if(sess) {
      const actions = []
      actions.push({
        account: "eosio.token",
        name: "transfer",
        authorization: [sess.permissionLevel],
        data: {
          from: sess.actor,
          to: "nftwatchdao",
          quantity: "12500.0000 XPR",
          memo: "shielding",
        },
      })
      actions.push({
        account: "nftwatchdao",
        name: "reqshielding",
        authorization: [sess.permissionLevel],
        data: {
          collection: colToReqShield,
          requester: sess.actor,
          requestMarketplace: "soonmarket",
          skipBasicCheck: skipBasicCheck,
          skipReason: skipReasonToReqShield
        },
      })
      await sess.transact({ actions }, { broadcast: true })
    }
  }

  return (
    <>
    <div className="min-h-screen px-3">
      <div className="py-2 flex flex-row items-center"> 
        <div className="ml-auto">
        { sess ? (
          <>
          <span className="mr-2 font-bold">{ actorName }</span>
          <button type="button"
                  className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  onClick={logout}>Logout</button>
          </>
        ) : (
          <button type="button"
                  className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  onClick={login}>Login</button>
        )}
          <button
              type="button"
              onClick={() => window.open("https://nftwatchdao.com", "_blank")}
              className="rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700 dark:hover:bg-neutral-700">
              Learn More
          </button>
        </div>
      </div>
      <h1 className="mb-2 mt-0 text-5xl font-medium leading-tight text-primary">
        NFT Watch DAO
      </h1>
      <div className="py-2 border-t-2 border-zinc-300">
        {
          !sess && (
            <>
              <div>Login to see possible actions.</div>
            </>
          )
        }
        {
           sess && (
            <>
              <div className="mb-3">
                <TETabs>
                <TETabsItem
                    onClick={() => handleBasicClick("community-actions")}
                    active={basicActive === "community-actions"}
                  >
                    Community Actions
                  </TETabsItem>
                  <TETabsItem
                    onClick={() => handleBasicClick("guard-actions")}
                    active={basicActive === "guard-actions"}
                  >
                    Guard Actions
                  </TETabsItem>
                </TETabs>

                <TETabsContent>
                  <TETabsPane show={basicActive === "guard-actions"}>
                    <h5 className="mb-2 mt-0 text-xl font-medium leading-tight text-primary">
                      Manage Lists
                    </h5>                    
                    <div id="manageActions">
                      <div className="rounded-t-lg border border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                        <h2 className="mb-0" id="headingOne">
                          <button
                            className={`${
                              activeAction === "addblacklist" &&
                              `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
                            } group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white`}
                            type="button"
                            onClick={() => handleActionAccordionClick("addblacklist")}
                            aria-expanded="true"
                            aria-controls="collapseOne"
                          >
                            <b>addblacklist</b>
                            <span
                              className={`${
                                activeAction === "addblacklist"
                                  ? `rotate-[-180deg] -mr-1`
                                  : `rotate-0 fill-[#212529]  dark:fill-white`
                              } ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-6 w-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                />
                              </svg>
                            </span>
                          </button>
                        </h2>
                        <TECollapse
                          show={activeAction === "addblacklist"}
                          className="!mt-0 !rounded-b-none !shadow-none space-x-2"
                        >
                          <div className="px-5 py-5 space-y-4">
                            <TETextarea
                              id="toBlacklist"
                              label="Collection(s) to blacklist"
                              value={toBlacklist}
                              placeholder='e.g. 511551323225,554331121133'
                              onChange={handleToBlacklist}
                            ></TETextarea>
                            <TETextarea
                              id="blacklistComment"
                              label="Comment / Reason"
                              value={blacklistComment}
                              placeholder='e.g. fake copy scam'
                              onChange={handleBlacklistComment}
                            ></TETextarea>
                            <button type="button"
                                    className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] disabled:opacity-70"
                                    onClick={doBlacklist}
                                    disabled={!(toBlacklist && blacklistComment)}>
                              Blacklist
                            </button>
                          </div>
                        </TECollapse>
                      </div>
                    </div>
                    <div className="border border-t-0 border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                      <h2 className="mb-0" id="headingTwo">
                        <button
                          className={`${
                            activeAction === "addshielding"
                              ? `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
                              : `transition-none rounded-b-[15px]`
                          } group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white`}
                          type="button"
                          onClick={() => handleActionAccordionClick("addshielding")}
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                           <b>addshielding</b>
                          <span
                            className={`${
                              activeAction === "addshielding"
                                ? `rotate-[-180deg] -mr-1`
                                : `rotate-0 fill-[#212529] dark:fill-white`
                            } ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-6 w-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                              />
                            </svg>
                          </span>
                        </button>
                      </h2>
                      <TECollapse
                        show={activeAction === "addshielding"}
                        className="!mt-0 !rounded-b-none !shadow-none"
                      >
                        <div className="px-5 py-5 space-y-4">
                          <TEInput
                            id="colToShield"
                            label="Collection to shield"
                            value={colToShield}
                            placeholder='e.g. zvapir55jvu4'
                            onChange={handleColToShield}
                          ></TEInput>
                          <TEInput
                            id="reportCidToShield"
                            label="Report IPFS Hash/CID"
                            value={reportCidToShield}
                            placeholder='e.g. Qm... or bafy...'
                            onChange={handleReportCidToShield}
                          ></TEInput>
                          <TETextarea
                            id="skipReasonToShield"
                            label="Reason"
                            value={skipReasonToShield}
                            placeholder='e.g. fake copy scam'
                            onChange={handleSkipReasonToShield}
                          ></TETextarea>
                          <button type="button"
                                  className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] disabled:opacity-70"
                                  onClick={doShield}
                                  disabled={!(colToShield && reportCidToShield && skipReasonToShield)}>
                            Shield
                          </button>
                        </div>
                      </TECollapse>
                    </div>

                    <h5 className="mb-2 mt-0 text-xl font-medium leading-tight text-primary mt-5">
                      Review Blacklisting Reports
                    </h5>  
                    <div id="reviewReport">
                      <div className="rounded-t-lg border border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                        <h2 className="mb-0" id="headingOne">
                          <button
                            className={`${
                              activeAction === "confirmrep" &&
                              `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
                            } group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white`}
                            type="button"
                            onClick={() => handleActionAccordionClick("confirmrep")}
                            aria-expanded="true"
                            aria-controls="collapseOne"
                          >
                            <b>confirmrep</b>
                            <span
                              className={`${
                                activeAction === "confirmrep"
                                  ? `rotate-[-180deg] -mr-1`
                                  : `rotate-0 fill-[#212529]  dark:fill-white`
                              } ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-6 w-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                />
                              </svg>
                            </span>
                          </button>
                        </h2>
                        <TECollapse
                          show={activeAction === "confirmrep"}
                          className="!mt-0 !rounded-b-none !shadow-none space-x-2"
                        >
                          <div className="px-5 py-5 space-y-4">
                            <TEInput
                              id="toConfirmBlacklist"
                              label="Collection to confirm blacklisting"
                              value={toConfirmBlacklist}
                              placeholder='e.g. 511551323225'
                              onChange={handleToConfirmBlacklist}
                            ></TEInput>
                            <TETextarea
                              id="confirmBlacklistComment"
                              label="Comment"
                              value={confirmBlacklistComment}
                              placeholder='e.g. fake copy scam'
                              onChange={handleConfirmBlacklistComment}
                            ></TETextarea>
                            <button type="button"
                                    className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] disabled:opacity-70"
                                    onClick={doConfirmBlacklisting}
                                    disabled={!(toConfirmBlacklist && confirmBlacklistComment)}>
                              Confirm Blacklisting
                            </button>
                          </div>
                        </TECollapse>
                      </div>
                    </div>
                    <div className="border border-t-0 border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                      <h2 className="mb-0" id="headingTwo">
                        <button
                          className={`${
                            activeAction === "rejectreport"
                              ? `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
                              : `transition-none rounded-b-[15px]`
                          } group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white`}
                          type="button"
                          onClick={() => handleActionAccordionClick("rejectreport")}
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                           <b>rejectreport</b>
                          <span
                            className={`${
                              activeAction === "rejectreport"
                                ? `rotate-[-180deg] -mr-1`
                                : `rotate-0 fill-[#212529] dark:fill-white`
                            } ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-6 w-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                              />
                            </svg>
                          </span>
                        </button>
                      </h2>
                      <TECollapse
                        show={activeAction === "rejectreport"}
                        className="!mt-0 !rounded-b-none !shadow-none"
                      >
                        <div className="px-5 py-5 space-y-4">
                          <TEInput
                            id="colToRejectReport"
                            label="Collection to reject blacklisting"
                            value={colToRejectReport}
                            placeholder='e.g. zvapir55jvu4'
                            onChange={handleColToRejectReport}
                          ></TEInput>
                          <TETextarea
                            id="rejectBlacklistComment"
                            label="Reason"
                            value={rejectBlacklistComment}
                            placeholder='e.g. fake copy scam'
                            onChange={handleRejectBlacklistComment}
                          ></TETextarea>
                          <button type="button"
                                  className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] disabled:opacity-70"
                                  onClick={doRejectBlacklisting}
                                  disabled={!(colToRejectReport && rejectBlacklistComment)}>
                            Reject Blacklisting
                          </button>
                        </div>
                      </TECollapse>
                    </div>

                    <h5 className="mb-2 mt-0 text-xl font-medium leading-tight text-primary mt-5">
                      Review Shielding Request
                    </h5>  
                    <div id="reviewShieldingRequest">
                      <div className="rounded-t-lg border border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                        <h2 className="mb-0" id="headingOne">
                          <button
                            className={`${
                              activeAction === "confshield" &&
                              `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
                            } group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white`}
                            type="button"
                            onClick={() => handleActionAccordionClick("confshield")}
                            aria-expanded="true"
                            aria-controls="collapseOne"
                          >
                            <b>confshield</b>
                            <span
                              className={`${
                                activeAction === "confshield"
                                  ? `rotate-[-180deg] -mr-1`
                                  : `rotate-0 fill-[#212529]  dark:fill-white`
                              } ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-6 w-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                />
                              </svg>
                            </span>
                          </button>
                        </h2>
                        <TECollapse
                          show={activeAction === "confshield"}
                          className="!mt-0 !rounded-b-none !shadow-none space-x-2"
                        >
                          <div className="px-5 py-5 space-y-4">
                            <TEInput
                              id="colToConfirmShield"
                              label="Collection to confirm shielding"
                              value={colToConfirmShield}
                              placeholder='e.g. 511551323225'
                              onChange={handleColToConfirmShield}
                            ></TEInput>
                            <TEInput
                              id="confirmShieldReportCid"
                              label="Report IPFS Hash/CID"
                              value={confirmShieldReportCid}
                              placeholder='e.g. Qm... or bafy...'
                              onChange={handleConfirmShieldReportCid}
                            ></TEInput>
                            <button type="button"
                                    className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] disabled:opacity-70"
                                    onClick={doConfirmShielding}
                                    disabled={!(colToConfirmShield && confirmShieldReportCid)}>
                              Confirm Shielding
                            </button>
                          </div>
                        </TECollapse>
                      </div>
                    </div>
                    <div className="border border-t-0 border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                      <h2 className="mb-0" id="headingTwo">
                        <button
                          className={`${
                            activeAction === "rejectshield"
                              ? `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
                              : `transition-none rounded-b-[15px]`
                          } group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white`}
                          type="button"
                          onClick={() => handleActionAccordionClick("rejectshield")}
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                           <b>rejectshield</b>
                          <span
                            className={`${
                              activeAction === "rejectshield"
                                ? `rotate-[-180deg] -mr-1`
                                : `rotate-0 fill-[#212529] dark:fill-white`
                            } ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-6 w-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                              />
                            </svg>
                          </span>
                        </button>
                      </h2>
                      <TECollapse
                        show={activeAction === "rejectshield"}
                        className="!mt-0 !rounded-b-none !shadow-none"
                      >
                        <div className="px-5 py-5 space-y-4">
                          <TEInput
                            id="colToRejectShield"
                            label="Collection to reject shielding"
                            value={colToRejectShield}
                            placeholder='e.g. 511551323225'
                            onChange={handleColToRejectShield}
                          ></TEInput>
                          <TEInput
                            id="rejectShieldReportCid"
                            label="Report IPFS Hash/CID"
                            value={rejectShieldReportCid}
                            placeholder='e.g. Qm... or bafy...'
                            onChange={handleRejectShieldReportCid}
                          ></TEInput>
                          <button type="button"
                                  className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] disabled:opacity-70"
                                  onClick={doRejectShielding}
                                  disabled={!(colToRejectShield && rejectShieldReportCid)}>
                            Reject Shielding
                          </button>
                        </div>
                      </TECollapse>
                    </div>
                  </TETabsPane>
                  <TETabsPane show={basicActive === "community-actions"}>          
                    <div id="communityActions">
                      <div className="rounded-t-lg border border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                        <h2 className="mb-0" id="headingOne">
                          <button
                            className={`${
                              activeAction === "report" &&
                              `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
                            } group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white`}
                            type="button"
                            onClick={() => handleActionAccordionClick("report")}
                            aria-expanded="true"
                            aria-controls="collapseOne"
                          >
                            <b>report</b>
                            <span
                              className={`${
                                activeAction === "report"
                                  ? `rotate-[-180deg] -mr-1`
                                  : `rotate-0 fill-[#212529]  dark:fill-white`
                              } ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-6 w-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                />
                              </svg>
                            </span>
                          </button>
                        </h2>
                        <TECollapse
                          show={activeAction === "report"}
                          className="!mt-0 !rounded-b-none !shadow-none space-x-2"
                        >
                          <div className="px-5 py-5 space-y-4">
                            <TEInput
                              id="colToReport"
                              label="Collection to report"
                              value={colToReport}
                              placeholder='e.g. 511551323225'
                              onChange={handleColToReport}
                            ></TEInput>
                            <TETextarea
                              id="reportReason"
                              label="Reason"
                              value={reportReason}
                              placeholder='e.g. fake copy scam'
                              onChange={handleReportReason}
                            ></TETextarea>
                            <button type="button"
                                    className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] disabled:opacity-70"
                                    onClick={doReport}
                                    disabled={!(colToReport && reportReason)}>
                              Report Collection
                            </button>
                          </div>
                        </TECollapse>
                      </div>
                    </div>
                    <div className="border border-t-0 border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                      <h2 className="mb-0" id="headingTwo">
                        <button
                          className={`${
                            activeAction === "reqshielding"
                              ? `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
                              : `transition-none rounded-b-[15px]`
                          } group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white`}
                          type="button"
                          onClick={() => handleActionAccordionClick("reqshielding")}
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                           <b>reqshielding</b>
                          <span
                            className={`${
                              activeAction === "reqshielding"
                                ? `rotate-[-180deg] -mr-1`
                                : `rotate-0 fill-[#212529] dark:fill-white`
                            } ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-6 w-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                              />
                            </svg>
                          </span>
                        </button>
                      </h2>
                      <TECollapse
                        show={activeAction === "reqshielding"}
                        className="!mt-0 !rounded-b-none !shadow-none"
                      >
                        <div className="px-5 py-5 space-y-4">
                          <TEInput
                            id="colToReqShield"
                            label="Collection to request shielding"
                            value={colToReqShield}
                            placeholder='e.g. zvapir55jvu4'
                            onChange={handleColToReqShield}
                          ></TEInput>
                          <input
                              className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                              type="checkbox"
                              checked={skipBasicCheck}
                              onChange={handleSkipBasicCheck}
                              role="switch"
                              id="skipBasicCheck" />
                          <label
                              className="inline-block pl-[0.15rem] hover:cursor-pointer"
                              htmlFor="skipBasicCheck"
                          >Skip Basic Check (consult with guards before!)</label>
                          <TETextarea
                            id="skipReasonToReqShield"
                            label="Skip Reason"
                            value={skipReasonToReqShield}
                            disabled={!skipBasicCheck}
                            placeholder='e.g. already creator of another shielded collection'
                            onChange={handleSkipReasonToReqShield}
                          ></TETextarea>
                          <p className="italic">Note: You will send <b>12,500.0000 XPR</b> (<Link className="underline" to="https://nftwatchdao.com/shielding/#shielding-fee" target="_blank">Shielding Fee</Link>) to the nftwatchdao account when signing the transaction!</p>
                          <button type="button"
                                  className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] disabled:opacity-70"
                                  onClick={doRequestShield}
                                  disabled={!colToReqShield}>
                            Request Shield
                          </button>
                        </div>
                      </TECollapse>
                    </div>
                  </TETabsPane>
                </TETabsContent>
              </div>
            </>
           )
        }
      </div>
    </div>
    
    </>
  )
}

export default App
