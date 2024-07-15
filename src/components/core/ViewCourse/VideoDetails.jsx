import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { useLocation } from "react-router-dom";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import IconBtn from "../../Common/IconBtn";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const playerRef = useRef();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, completedLectures } = useSelector((state) => state.viewCourse);

  const [videoData, setVideoData] = useState(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setVideoSpecificDetails = async () => {
      if (!courseSectionData.length || !courseId || !sectionId || !subSectionId) {
        navigate(`/dashboard/enrolled-courses`);
      } else {
        const filteredData = courseSectionData.find((course) => course._id === sectionId);
        if (filteredData) {
          const filteredVideoData = filteredData.subSection.find((data) => data._id === subSectionId);
          setVideoData(filteredVideoData);
          setVideoEnded(false);
        }
      }
    };
    setVideoSpecificDetails();
  }, [courseSectionData, courseId, sectionId, subSectionId, navigate]);

  const isFirstVideo = () => {
    if (!courseSectionData.length) return false;
    const firstSection = courseSectionData[0];
    const firstSubSection = firstSection?.subSection?.[0];
    return firstSection?._id === sectionId && firstSubSection?._id === subSectionId;
  };

  const isLastVideo = () => {
    if (!courseSectionData.length) return false;
    const lastSection = courseSectionData[courseSectionData.length - 1];
    const lastSubSection = lastSection?.subSection?.[lastSection.subSection.length - 1];
    return lastSection?._id === sectionId && lastSubSection?._id === subSectionId;
  };

  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(data => data._id === sectionId);
    if (currentSectionIndex === -1) return;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection?.findIndex(data => data._id === subSectionId);
    if (currentSubSectionIndex === -1) return;

    const nextSubSectionIndex = currentSubSectionIndex + 1;
    if (nextSubSectionIndex < courseSectionData[currentSectionIndex]?.subSection?.length) {
      const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[nextSubSectionIndex]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
    } else if (currentSectionIndex < courseSectionData.length - 1) {
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
      const nextSubSectionId = courseSectionData[currentSectionIndex + 1]?.subSection?.[0]?._id;
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
    }
  };

  const goToPrevVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(data => data._id === sectionId);
    if (currentSectionIndex === -1) return;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection?.findIndex(data => data._id === subSectionId);
    if (currentSubSectionIndex === -1) return;

    const prevSubSectionIndex = currentSubSectionIndex - 1;
    if (prevSubSectionIndex >= 0) {
      const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[prevSubSectionIndex]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`);
    } else if (currentSectionIndex > 0) {
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
      const prevSubSectionLength = courseSectionData[currentSectionIndex - 1]?.subSection?.length;
      const prevSubSectionId = courseSectionData[currentSectionIndex - 1]?.subSection?.[prevSubSectionLength - 1]?._id;
      navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`);
    }
  };

  const handleLectureCompletion = async () => {
    setLoading(true);
    const res = await markLectureAsComplete({ courseId: courseId, subsectionId: subSectionId }, token);
    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <p>Loading...</p>
      ) : (
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <ReactPlayer
            ref={playerRef}
            url={"https://youtu.be/Vi9bxu-M-ag?si=S-pjaXyq7Vaet8ry"} // Use videoUrl from videoData
            className="absolute top-0 left-0"
            width="100%"
            height="100%"
            playing
            controls
            onEnded={() => setVideoEnded(true)}
          />
          {videoEnded && (
            <div
              style={{
                backgroundImage: "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1))",
              }}
              className="absolute inset-0 z-[100] grid h-full place-content-center font-inter"
            >
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onClick={handleLectureCompletion}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-xl max-w-max px-4 mx-auto"
                />
              )}
              <IconBtn
                disabled={loading}
                onClick={() => {
                  if (playerRef?.current) {
                    playerRef.current.seekTo(0);
                    setVideoEnded(false);
                  }
                }}
                text="Rewatch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />
              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button disabled={loading} onClick={goToPrevVideo} className="blackButton">
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button disabled={loading} onClick={goToNextVideo} className="blackButton">
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  );
};

export default VideoDetails;
