import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

interface YouTubeChannel {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
  statistics: {
    subscriberCount: string;
    viewCount: string;
  };
}

export function FetchYouTubeAccount() {
  const { getToken } = useAuth();
  const [channelData, setChannelData] = useState<YouTubeChannel | null>(null);

//   const fetchYouTubeData = async () => {
//     const token = await getToken({ template: "oauth_google" });

//     if (!token) {
//       console.error("No Google OAuth token found");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`YouTube API error: ${response.statusText}`);
//       }

//       const data: { items: YouTubeChannel[] } = await response.json();
      
//       if (data.items && data.items.length > 0) {
//         setChannelData(data.items[0]);
//       } else {
//         console.warn("No YouTube channel data found.");
//       }
//     } catch (error) {
//       console.error("Error fetching YouTube data:", error);
//     }
//   };

  const fetchYouTubeData = async () => {
    try {
        const token = await getToken();
        console.log("OAuth Token:", token);

        if (!token) {
            console.error("No Google OAuth token found");
            return;
        }

        const response = await fetch(
            "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );

        const data = await response.json();
        console.log("YouTube API Response:", data);

        if (data.error) {
            throw new Error(`YouTube API error: ${JSON.stringify(data.error)}`);
        }

        if (data.items && data.items.length > 0) {
            setChannelData(data.items[0]);
        }
    } catch (error) {
        console.error("Error fetching YouTube data:", error);
    }
};

  return (
    <div>
      <button onClick={fetchYouTubeData}>Fetch YouTube Account</button>
      {channelData && (
        <div>
          <h2>{channelData.snippet.title}</h2>
          <img src={channelData.snippet.thumbnails.default.url} alt="YouTube Profile" />
          <p>Subscribers: {channelData.statistics.subscriberCount}</p>
          <p>Total Views: {channelData.statistics.viewCount}</p>
        </div>
      )}
    </div>
  );
}
